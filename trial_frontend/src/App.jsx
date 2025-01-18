import Chatbot from './components/Chatbot';
import logo from './assets/images/logo.svg';
import { GoAlertFill } from "react-icons/go";


function App() {

  return (
    <div className='flex flex-col min-h-full w-full max-w-3xl mx-auto px-4'>
      <header className='sticky top-0 shrink-0 z-20 bg-white'>
        <div className='flex flex-col h-full w-full gap-1 pt-4 pb-2 bg-dark'>
          <a href="https://piratesalert.com" style={{ fontSize: "1.3rem"}}>
            <h1 style={{display: "inline",marginRight: "8px"}}>Team Mavericks</h1>
              {/* <GoAlertFill style={{ display: 'inline', verticalAlign: 'middle', marginBottom:"5px" }} />
              LERT */}
          </a>

          <h1 className='font-urbanist text-[1.65rem] font-semibold'>DOC AI</h1>
        </div>
      </header>
      <Chatbot />
    </div>
  );
}

export default App;