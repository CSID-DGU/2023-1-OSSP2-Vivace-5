import React from "react";
import { Editor } from "@toast-ui/react-editor";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import Prism from "prismjs";
import tableMergedCell from "@toast-ui/editor-plugin-table-merged-cell";
import uml from "@toast-ui/editor-plugin-uml";
import chart from "@toast-ui/editor-plugin-chart";

import "@toast-ui/editor/dist/toastui-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css";
import "@toast-ui/chart/dist/toastui-chart.css";

interface MarkdownEditorProps {
  content: string;
  editorRef: React.MutableRefObject<any>;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ content = "", editorRef }) => {
  const toolbarItems = [
    ["heading", "bold", "italic", "strike"],
    ["hr", "quote"],
    ["ul", "ol", "task"],
    ["table", "link"],
    ["image"],
    ["code"],
    ["scrollSync"],
  ];

  return (
    <React.Fragment>
      {editorRef && (
        <Editor
          ref={editorRef}
          initialValue={content || " "}
          initialEditType="markdown"
          previewStyle={window.innerWidth > 1000 ? "vertical" : "tab"}
          hideModeSwitch={true}
          height="calc(100vh - 300px)"
          theme={""}
          usageStatistics={false}
          toolbarItems={toolbarItems}
          useCommandShortcut={true}
          plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }], tableMergedCell, uml, chart]}
        />
      )}
    </React.Fragment>
  );
};

export default MarkdownEditor;
