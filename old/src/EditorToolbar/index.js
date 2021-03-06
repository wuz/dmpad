import React, { useState, useRef, useContext } from "react";
import {
  // QuestionOutlined,
  SaveOutlined,
  ExportOutlined,
  ImportOutlined,
  // RedoOutlined,
  // UndoOutlined,
  // SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import logo from "../logo.svg";
import "./EditorToolbar.scss";
import Modal from "../components/Modal";
// import { nanoid } from 'nanoid';
import Tippy from "@tippyjs/react";
import { FilesystemContext } from "../Filesystem";

const reader = new FileReader();

const EditorToolbar = ({ setShowAccounts }) => {
  const {
    currentDocument,
    setCurrentDocument,
    saving: autoSaving,
  } = useContext(FilesystemContext);
  const filename = currentDocument?.fileName;
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [validDoc, setValidDoc] = useState(false);
  const uploadDocInput = useRef(null);
  const importDoc = () => {
    if (uploadDocInput.current?.files && uploadDocInput.current.files[0]) {
      reader.onload = () => {
        try {
          const contents = JSON.parse(reader.result);
          setCurrentDocument(contents);
          setShowImportModal(false);
        } catch (err) {
          setValidDoc(false);
        }
      };
      reader.readAsText(uploadDocInput.current.files[0]);
    }
  };
  const validateDoc = () => {
    setValidDoc(true);
  };
  const importDocModal = showImportModal && (
    <Modal>
      <div className="c-EditorToolbar-importModal flow">
        <h1>Import a file...</h1>
        <form>
          <input type="file" ref={uploadDocInput} onChange={validateDoc} />
          {validDoc ? "Looks good!" : "Oops, looks like that file is invalid"}
        </form>
        <button disabled={!validDoc} onClick={importDoc}>
          import
        </button>
        <button onClick={() => setShowImportModal(false)}>close</button>
      </div>
    </Modal>
  );
  const aboutModal = showAboutModal && (
    <Modal>
      <div className="c-EditorToolbar-aboutModal flow flex[ ai-c fd-c ]">
        <img src={logo} alt="Logo" className="logo" />
        <h1>dmpad</h1>
        <p>
          dmpad is a note taking tool for dungeon masters of all kinds. Prepare
          your sessions, design your dungeons, and keep track of your game.
        </p>
        <div>
          <a href="https://wuz.sh">Built by Wuz</a>
        </div>
        <button onClick={() => setShowAboutModal(false)}>close</button>
      </div>
    </Modal>
  );
  const exportDoc = () => {
    const file = new Blob([JSON.stringify(currentDocument)], {
      type: "text/json",
    });
    const objectUrl = window.URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `${filename}.json`;
    a.click();
  };
  return (
    <div className="c-EditorToolbar">
      <Tippy interactive={true} content="About" placement="right">
        <button
          className="flex[ fd-c ai-c jc-c ] nopad"
          onClick={() => setShowAboutModal(true)}
        >
          <img src={logo} className="logo" />
        </button>
      </Tippy>
      <Tippy interactive={true} content="Account" placement="right">
        <button onClick={() => setShowAccounts(true)}>
          <UserOutlined />
        </button>
      </Tippy>
      <Tippy interactive={true} content="Export" placement="right">
        <button onClick={exportDoc}>
          <ExportOutlined />
        </button>
      </Tippy>
      <Tippy interactive={true} content="Import" placement="right">
        <button onClick={() => setShowImportModal(true)}>
          <ImportOutlined />
        </button>
      </Tippy>
      {/* <button onClick={addSticker}>
        <SmileOutlined />
      </button> */}
      <div className="c-EditorToolbar-autosave flex[ fd-c ai-c jc-c ]">
        <SaveOutlined /> {autoSaving ? "Saving..." : "Saved"}
      </div>
      {aboutModal}
      {importDocModal}
    </div>
  );
};

export default EditorToolbar;
