// src/types.ts
import { Descendant, Text as SlateText } from 'slate';

// Define custom text node type
export type CustomText = {
  text: string;
  bold?: boolean;
  highlight?: string;
};

// Define custom element node type
export type CustomElement = {
  type: 'paragraph' | 'heading';
  children: CustomText[];
};

// Extend Slate's Descendant type
export type CustomDescendant = CustomElement | CustomText;

// Ensure CustomDescendant extends Slate's Descendant
export type CustomDescendantExtended = CustomDescendant & Descendant;
