// import ReactQuill, {Quill} from 'react-quill';

import dynamic from "next/dynamic";
// let imgResize
// let parchment
// let module
const ReactQuill = dynamic(
  async () => {
    if(typeof window !== undefined){}
    const { default: RQ } = await import("react-quill");
    const { default: ImageResize } = await import("quill-image-resize-module-react")
    const { default: Parchment } = await RQ.Quill.import("parchment")
    // parchment = Parchment
    // imgResize={parchment: Parchment, modules:["Resize", "DisplaySize", "Toolbar"]}
    RQ.Quill.register('modules/ImageResize', ImageResize);
    let SizeStyle = RQ.Quill.import('attributors/style/size');
    SizeStyle.whitelist = ['10px', '12px', '14px','16px','18px','20px','24px','26px','32px','48px'] 
    RQ.Quill.register(SizeStyle, true);
    let FontStyle = RQ.Quill.import('formats/font');
    FontStyle.whitelist = ['맑은고딕', '본고딕','나눔고딕','주아체','나눔글씨체','검은고딕','여기어때잘난체','가나초콜릿체','동해독도체','동글체','귀욤체','감자꽃마을']
    RQ.Quill.register(FontStyle, true);

  Editor.modules = {
    toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        
    ['blockquote'],             
    [{
      'list': 'ordered'}, {
      'list': 'bullet'}],
    [{
      'script': 'sub'}, {
      'script': 'super'}],      
    [{
      'indent': '-1'}, {
      'indent': '+1'}],         
    [{
      'direction': 'rtl'}],                         
    [{
      'size':  ['10px', '12px', '14px','16px','18px','20px','24px','26px','32px','48px'] }], 
    [{
      'color': []}, {
      'background': []}],          
    [{
      'font':  ['맑은고딕', '본고딕','나눔고딕','주아체','나눔글씨체','검은고딕','여기어때잘난체','가나초콜릿체','동해독도체','동글체','귀욤체','감자꽃마을']}],
    [{
      'align': []}],
    ['link', 'image', 'video'],
    ['clean']                                      
  ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false
    },

    // ImageResize: {
    //   imgResize
    // }
    ImageResize: {
      parchment: RQ.Quill.import("parchment"),
      modules: ["Resize", "DisplaySize", "Toolbar"],
    }
  };


    return function forwardRef({ forwardedRef, ...props }) {
      return <RQ ref={forwardedRef} modules={Editor.modules} {...props} />;
    };
  },
  {
    ssr: false,
  }
);
import React, { useRef, useEffect, useState } from "react"
import { compressImage } from 'src/public/hooks/compressImage';
import { firebaseHooks } from 'firebase/hooks';
// import ImageResize from 'quill-image-resize-module-react';
import 'quill/dist/quill.snow.css'

// import "react-quill/dist/quill.snow.css";
// Quill.register('modules/ImageResize', ImageResize);
// let SizeStyle = Quill.import('attributors/style/size');
// SizeStyle.whitelist = ['10px', '12px', '14px','16px','18px','20px','24px','26px','32px','48px'] 
// Quill.register(SizeStyle, true);
// let FontStyle = Quill.import('formats/font');
// FontStyle.whitelist = ['맑은고딕', '본고딕','나눔고딕','주아체','나눔글씨체','검은고딕','여기어때잘난체','가나초콜릿체','동해독도체','동글체','귀욤체','감자꽃마을']
// Quill.register(FontStyle, true);


//<Editor path={`content/${id}`} handleChange={onTextChange} textData={textData} />
const Editor = (props) => {
  const quillRef = useRef(null)
  const [text, setText] = useState("")
  useEffect(() => {
    console.log(props.textData)
  },[props.textData])
  useEffect(() => {
    // console.log(props.handleChange())
    setText(props.data)
    const handleImage = async () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      input.onchange = async () => {
        const file = input.files[0];

        // 현재 커서 위치 저장
        const range = quillRef.current.getEditor().getSelection(true);

        // 서버에 올려질때까지 표시할 로딩 placeholder 삽입
       quillRef.current.getEditor().insertEmbed(range.index, "image", `image/loading.gif`);

        try {
          // 필자는 파이어 스토어에 저장하기 때문에 이런식으로 유틸함수를 따로 만들어줬다
          // 이런식으로 서버에 업로드 한뒤 이미지 태그에 삽입할 url을 반환받도록 구현하면 된다 
          // 나는 여기에 이미지 사이즈가 2MB가 넘으면 자동으로 압축시킬꺼다
          let img
          if (!checkIsImageSize(file.size)) {
            if (confirm("이미지 용량이 2MB가 넘습니다. 이미지를 압축할까요?\n(취소를 누르면 원본 그대로 저장됩니다. 고화질 용량에 주의하세요")) {
              img = await compressImage(file)
            }else img = file
          }else img = file
          const filePath = `${props.path}/${Date.now()}`;
          const url = await firebaseHooks.upload_image_to_storage(img, filePath); 
          
          // 정상적으로 업로드 됐다면 로딩 placeholder 삭제
          quillRef.current.getEditor().deleteText(range.index, 1);
          // 받아온 url을 이미지 태그에 삽입
          quillRef.current.getEditor().insertEmbed(range.index, "image", url);
          
          // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
          quillRef.current.getEditor().setSelection(range.index + 1);
        } catch (e) {
          quillRef.current.getEditor().deleteText(range.index, 1);
        }
      };
    }
    
    if (quillRef.current) {
      const toolbar = quillRef.current.getEditor().getModule("toolbar");
      toolbar.addHandler("image", handleImage);
    }
  }, []);

  const onChangeHTML = (html) => {
    console.log(html, props.index)
    if (props.custom !== true) {
      if (props.index === undefined)
        props.handleChange(html)
      else {
        props.handleChange(html, props.index)
      }
    }
      
  }

    //이미지의 크기가 2MB이하인지 확인 후, 아니라면 압축할지 물어본뒤 압축진행.
  const checkIsImageSize = (img) => {
    const maxSize = 2 * 1024 * 1024; //2MB
    if (img > maxSize) {
      return false;
    }
    else
      return true
  }
  if(props.textData)
  return (
    <>
      <ReactQuill
        forwardedRef={quillRef}
        onChange={(content, delta, source, editor) => onChangeHTML(editor.getHTML())}
        modules={Editor.modules}
        formats={Editor.formats}
        value={props.textData || ""}
        bounds={'#root'}
        theme='snow'
        preserveWhitespace
      />
    </>
    );
  else
    return (
      <ReactQuill
        forwardedRef={quillRef}
        onChange={(content, delta, source, editor) => onChangeHTML(editor.getHTML())}
        // modules={Editor.modules}
        formats={Editor.formats}
        bounds={'#root'}
        theme='snow'
        preserveWhitespace
      />
    )
}

  // Editor.modules = {
  //   toolbar: [
  //   ['bold', 'italic', 'underline', 'strike'],        
  //   ['blockquote'],             
  //   [{
  //     'list': 'ordered'}, {
  //     'list': 'bullet'}],
  //   [{
  //     'script': 'sub'}, {
  //     'script': 'super'}],      
  //   [{
  //     'indent': '-1'}, {
  //     'indent': '+1'}],         
  //   [{
  //     'direction': 'rtl'}],                         
  //   [{
  //     'size':  ['10px', '12px', '14px','16px','18px','20px','24px','26px','32px','48px'] }], 
  //   [{
  //     'color': []}, {
  //     'background': []}],          
  //   [{
  //     'font':  ['맑은고딕', '본고딕','나눔고딕','주아체','나눔글씨체','검은고딕','여기어때잘난체','가나초콜릿체','동해독도체','동글체','귀욤체','감자꽃마을']}],
  //   [{
  //     'align': []}],
  //   ['link', 'image', 'video'],
  //   ['clean']                                      
  // ],
  //   clipboard: {
  //     // toggle to add extra line breaks when pasting HTML:
  //     matchVisual: false
  //   },

  //   // ImageResize: {
  //   //   imgResize
  //   // }
  //   ImageResize: {
  //     parchment: Parchment,
  //     modules: ["Resize", "DisplaySize", "Toolbar"],
  //   }
  // };

  /*
  * Quill editor formats
  * See https://quilljs.com/docs/formats/
  */
  Editor.formats = [

    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'video',

    'color',

    'align',
    'direction',
    'indent',
    'background',
    'script',
    'table'

  ];


export default Editor;
