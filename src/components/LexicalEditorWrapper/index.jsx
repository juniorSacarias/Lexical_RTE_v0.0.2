/* global localStorage */

import { $getRoot, $getSelection } from 'lexical';
import { useEffect, useState } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { MuiContentEditable, placeHolderSx } from './styles';
import { Box, Divider, useStepContext } from '@mui/material';
import { lexicalEditorConfig } from '../../config/lexicalEditorConfig';
import LexicalEditorTopBar from '../LexicalEditorTopBar';
import TreeViewPlugin from '../CustomPlugins/TreeViewPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import ImagesPlugin from '../CustomPlugins/ImagePlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin.js';
import FloatingTextFormatToolbarPlugin from '../CustomPlugins/FloatingTextFormatPlugin';

/**
 * Renders the wrapper component for the Lexical Editor.
 * LexicalComposer is the main component that wraps the editor. props: initialConfig and childrens
 * LexicalEditorTopBar is the top bar of the editor.
 * The box is the component in charge of encompassing the different plugins related to writing and events
 * RichTextPlugin  that adds major features for rich text editing, including typing, deletion, copy/pasting, indent/outdent and bold/italic/underline/strikethrough text formatting
 * RichTextPlugin props: contentEditable this is the style in reference the area, placeholder, ErrorBoundary
 * OnChangePlugin is a plugin that listens for changes in the editor state
 * HistoryPlugin is a plugin that adds undo and redo functionality to the editor
 * TreeViewPlugin is a plugin that adds a tree view to the editor, customPlugin
 * ListPlugin is a plugin that adds list functionality to the editor
 * LinkPlugin is a plugin that adds link functionality to the editor
 * ImagesPlugin is a plugin that adds image functionality to the editor, customPlugin
 */

function MyOnChangePlugin({ onChange }) {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			onChange(editorState);
		});
	}, [editor, onChange]);
	return null;
}

function LexicalEditorWrapper(props) {
	const [editorState, setEditorState] = useState();
	function onChange(editorState) {
		const editorStateJSON = editorState.toJSON();
		setEditorState(JSON.stringify(editorStateJSON));
		console.log(editorState)
	}
	return (
		<LexicalComposer initialConfig={lexicalEditorConfig}>
			<LexicalEditorTopBar />
			<Divider />
			<Box sx={{ position: 'relative', background: 'white' }}>
				<RichTextPlugin
					contentEditable={<MuiContentEditable />}
					placeholder={<Box sx={placeHolderSx}>Enter some text...</Box>}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<MyOnChangePlugin onChange={onChange} />
				<HistoryPlugin />
				<TreeViewPlugin />
				<ListPlugin />
				<LinkPlugin />
				<ImagesPlugin captionsEnabled={false} />
				<TablePlugin />
				<FloatingTextFormatToolbarPlugin />
			</Box>
		</LexicalComposer>
	);
}

function MyCustomAutoFocusPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		editor.focus();
	}, [editor]);

	return null;
}

export default LexicalEditorWrapper;
