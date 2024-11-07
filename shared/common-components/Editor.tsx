const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { Component } from "react";
import dynamic from "next/dynamic";

interface EditorProps {
  value?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

class Editor extends Component<EditorProps> {
  static modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  static formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  render() {
    const { value, onChange, placeholder } = this.props;
    return (
      <div>
        <ReactQuill
          theme="snow"
          onChange={onChange}
          value={value}
          modules={Editor.modules}
          formats={Editor.formats}
          bounds={".app"}
          placeholder={placeholder}
        />
      </div>
    );
  }
}

export default Editor;
