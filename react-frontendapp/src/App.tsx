import { useState, useRef, useEffect } from 'react';
import {instance} from "./utils/axios_instance";
import Message from "./components/Message";
import {useBoolean} from "./hooks/useBoolean";
import * as Dialog from "@radix-ui/react-dialog";
import {Grid} from 'react-loader-spinner';
import {AiOutlineArrowUp} from "react-icons/ai";
import ModalTrigger from "./components/ModalTrigger";
import {GrRotateLeft} from "react-icons/gr";

type Message={
  timestamp: Date | number,
  content: string,
  bot?: boolean,
  firstMsg?: boolean,
  messageId: string,
  sources?: Array<{source_url: string; source_text:string}> | [];
};
type SuggestionType = { text: string, url:string}
type InitationType = {InitialFirstMessage: string, token?: string, initiatorId?: string}

export default function App(
  {InitialFirstMessage, token, initiatorId}: InitationType{
    const {
      value: isOpen,
      setTrue: open, 
      toggle:toggle,
      setValue: setOpen
    }= useBoolean(false);
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState<Array<Message>> ([]);
    const [loading, setLoading] = useState(false);

    const [suggestions, setSuggestions]= useState<Array<SuggestionType> | []>([]);
    if (token){
      instance.defaults.headers['X-Bot-Token']= token;
    }
    else{
      console.warn("Bot token not provided")
    }
    useEffect(()=>{
      if (initatorId){
        const initiatorElement = document.getElementById(initiatorId);
        initiatorElement?.addEventListener("click", open);
        return () => initiatorElement?.removeEventListener("click",open);
      }
    },[])
  }
)
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
