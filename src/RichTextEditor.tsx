import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaBold, FaStar, FaComment, FaUndo, FaRedo } from 'react-icons/fa';

type MessgeDTO = {
    id: number;
    msg: string;
    range: number;
}
const RichTextEditor: React.FC = () => {
    const [editorValue, setEditorValue] = useState<string>('');
    const [showToolbar, setShowToolbar] = useState<boolean>(false);
    const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [showSlider, setShowSlider] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [bgColor, setBgColor] = useState("#fffff")
    const [showCommentPopup, setShowCommentPopup] = useState<boolean>(false);
    const [commentText, setCommentText] = useState<string>('');
    const [selectedRange, setSelectedRange] = useState<any>(null);
    const [tempEditor, setTempEditor] = useState<any>(null);
    const quillRef = useRef<ReactQuill>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState<MessgeDTO[]>([])
    const [showMessage, setShowMessage] = useState<String | null>(null)


    const getSliderColor = (value: number): string => {
        const colorPalette = [
            '#f71402',
            '#ed7066',
            '#f5aa69',
            '#f2770c',
            '#89eb75',
            '#1d9c03'
        ];
        const colorIndex = Math.floor((value / 100) * (colorPalette.length - 1));
        return colorPalette[colorIndex];
    };

    const getMsg = (number: number) => {
        const msg = message.find(obj => number > obj.id && number < obj.id + obj.range);
        return msg ? msg : null;
    };

    useEffect(() => {
        const editor = quillRef.current?.getEditor();
        if (editor) {
            editor.on('selection-change', (range) => {
                if (range && range.length > 0) {
                    const bounds = editor.getBounds(range);
                    if (bounds) {
                        setToolbarPosition({
                            top: bounds.top - 50,
                            left: bounds.left,
                        });
                        setShowToolbar(true);
                        setShowMessage(null)
                    }
                } else {
                    setShowToolbar(false);
                    setShowSlider(false);
                    setShowMessage(null);
                    setSliderValue(0)
                    setBgColor("fffff")
                }
            });
            editor.root.addEventListener('click', (event) => {
                const range = editor.getSelection();
                if (range) {


                    const findMsg = getMsg(range.index)

                    const bounds = editor.getBounds(range);
                    if (bounds && findMsg) {
                        setToolbarPosition({
                            top: bounds.top - 50,
                            left: bounds.left,
                        });
                        setShowMessage(findMsg.msg)
                    }

                }
            });
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                toolbarRef.current &&
                !toolbarRef.current.contains(event.target as Node) &&
                sliderRef.current &&
                !sliderRef.current.contains(event.target as Node)
            ) {
                setShowSlider(false);
                setShowToolbar(false);
                setShowMessage(null);
                setSliderValue(0);
                setBgColor("fffff");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (value: string) => {
        setEditorValue(value);
    };

    const handleBold = () => {
        const editor = quillRef.current?.getEditor();
        if (editor) {
            const range = editor.getSelection();
            if (range) {
                const isBold = editor.getFormat(range).bold;
                editor.format('bold', !isBold);
            }
        }
    };

    const handleRate = () => {
        setShowSlider(true);
        setShowToolbar(false);
        setShowMessage(null);
    };

    const handleComment = () => {
        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection();
        if (range) {
            setSelectedRange(range);
            setTempEditor(editor);
            setShowCommentPopup(true);
            setShowToolbar(false);
            setShowMessage(null);
        }
    };

    const handleSaveComment = () => {
        const editor = tempEditor;
        if (editor && selectedRange) {
            setSelectedRange(null);
            setTempEditor(null);
            editor.format('underline', Boolean(commentText))
            const index = message.length && message.findIndex(item => item.id === selectedRange.index);
            const tempMessage = message
            if (index !== -1 && message.length) {
                if (commentText) {
                    tempMessage[index].msg = commentText
                    setMessage(tempMessage)
                }
                else {
                    const temp = tempMessage.filter((item) => item.id !== tempMessage[index].id)
                    setMessage(temp)
                }

            } else {
                tempMessage.push({
                    id: selectedRange.index,
                    msg: commentText,
                    range: selectedRange.length
                })
                setMessage(tempMessage)
            }

        }
        setShowCommentPopup(false);
        setCommentText('');
    };

    const handleUndo = () => {
        const editor = quillRef.current?.getEditor();
        if (editor) {
            editor.history.undo();
        }
    };

    const handleRedo = () => {
        const editor = quillRef.current?.getEditor();
        if (editor) {
            editor.history.redo();
        }
    };

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setSliderValue(value);

        const editor = quillRef.current?.getEditor();
        if (editor) {
            const range = editor.getSelection();
            if (range) {
                const color = getSliderColor(value);
                setBgColor(color);
                editor.formatText(range.index, range.length, { background: color });
            }
        }
    };
    return (
        <div className="relative p-4 w-1/2 rounded-lg shadow-lg bg-white">
            <div className="flex space-x-2 p-2">
                <button onClick={handleUndo} className="p-1 border rounded bg-gray-200 hover:bg-gray-300">
                    <FaUndo />
                </button>
                <button onClick={handleRedo} className="p-1 border rounded bg-gray-200 hover:bg-gray-300">
                    <FaRedo />
                </button>
            </div>
            <div className='relative'>
                <ReactQuill
                    ref={quillRef}
                    value={editorValue}
                    onChange={handleChange}
                    modules={{
                        toolbar: false
                    }}
                    placeholder="Type here..."
                    className="border border-gray-300 rounded-lg h-[200px] custom-quill-editor"

                />
                {showToolbar && (
                    <div
                        ref={toolbarRef}
                        className="absolute bg-white border border-gray-300 rounded shadow-lg flex items-center space-x-2 p-2"
                        style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
                    >
                        <button onClick={handleBold} className="p-2 border rounded bg-gray-200 hover:bg-gray-300">
                            <FaBold />
                        </button>
                        <button onClick={handleRate} className="p-2 border rounded bg-gray-200 hover:bg-gray-300">
                            <FaStar />
                        </button>
                        <button onClick={handleComment} className="p-2 border rounded bg-gray-200 hover:bg-gray-300">
                            <FaComment />
                        </button>
                    </div>
                )}
                {showMessage &&
                    <div style={{ top: toolbarPosition.top + 70, left: toolbarPosition.left }}
                        className="absolute bg-black bg-opacity-90 text-white text-white text-sm border border-gray-300 rounded shadow-lg flex items-center px-2 py-px">
                        {showMessage}
                    </div>
                }
                {showSlider && (
                    <div
                        ref={sliderRef}
                        className="absolute bg-white border border-gray-300 rounded shadow-lg p-4"
                        style={{ top: toolbarPosition.top + 80, left: toolbarPosition.left, backgroundColor: bgColor }}
                    >
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderValue}
                            onChange={handleSliderChange}
                            className="w-full"
                        />
                        <div className="text-center text-sm">Rate: {sliderValue}</div>
                    </div>
                )}


                {showCommentPopup && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-4 rounded shadow-lg">
                            <h3 className="text-lg font-semibold mb-2">Add Comment</h3>
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="border p-2 w-full mb-2"
                                placeholder="Enter your comment"
                            />
                            <div className="flex justify-end space-x-2">
                                <button onClick={() => setShowCommentPopup(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                                <button onClick={handleSaveComment} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RichTextEditor;
