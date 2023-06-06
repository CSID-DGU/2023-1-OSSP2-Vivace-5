import React, { useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import "@toast-ui/editor/dist/i18n/ko-kr";

function MarkDown() {
    const editorRef = useRef<Editor | null>(null);

    const onChange = () => {
        if (editorRef.current) {
            const data = editorRef.current.getInstance().getHTML();
            console.log(data);
        }
    };

    return (
        <div className="edit_wrap" style={{ marginTop: "90px" }}>
            <Editor
                initialValue="hello react editor world!"
                previewStyle="vertical"
                height="500px"
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                language="ko-KR"
                ref={editorRef}
                onChange={onChange}
                plugins={[colorSyntax]}
            />
        </div>
    );
}

export default MarkDown;
