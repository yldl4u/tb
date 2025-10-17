import React, { useState, useEffect, useCallback } from 'react';
import { GithubIcon, ClipboardIcon, TrashIcon, CheckIcon, SwapIcon } from './components/Icons';

// --- Helper UI Components (Defined outside App to prevent re-renders) ---

const Header: React.FC = () => (
  <header className="border-b border-[#30363d] p-4">
    <div className="container mx-auto flex items-center justify-center gap-4">
      <GithubIcon className="w-8 h-8 text-[#c9d1d9]" />
      <h1 className="text-xl md:text-2xl font-bold text-[#c9d1d9]">
        Text &lt;-&gt; Binary Converter
      </h1>
    </div>
  </header>
);

const Footer: React.FC = () => (
    <footer className="border-t border-[#30363d] p-4 text-center">
        <p className="text-sm text-gray-400">
            Created By: Yldl4u
        </p>
    </footer>
);


interface ToolButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    ariaLabel: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({ onClick, children, ariaLabel }) => (
    <button
        onClick={onClick}
        aria-label={ariaLabel}
        className="p-2 rounded-md text-gray-400 hover:bg-[#30363d] hover:text-white transition-colors duration-200"
    >
        {children}
    </button>
);


// --- Main Application Component ---
type ConversionMode = 'textToBinary' | 'binaryToText';

const App: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [outputText, setOutputText] = useState<string>('');
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [mode, setMode] = useState<ConversionMode>('textToBinary');

    useEffect(() => {
        if (inputText.trim() === '') {
            setOutputText('');
            return;
        }

        try {
            if (mode === 'textToBinary') {
                const binaryString = inputText
                    .split('')
                    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
                    .join(' ');
                setOutputText(binaryString);
            } else { // binaryToText
                const textString = inputText
                    .trim()
                    .split(/\s+/)
                    .map(binaryChunk => {
                        if (!/^[01]+$/.test(binaryChunk)) {
                            throw new Error("Invalid binary character detected.");
                        }
                        return String.fromCharCode(parseInt(binaryChunk, 2));
                    })
                    .join('');
                setOutputText(textString);
            }
        } catch (error) {
            console.error("Conversion error:", error);
            setOutputText("Error: Invalid input format.");
        }
    }, [inputText, mode]);

    const handleCopy = useCallback(() => {
        if (!outputText) return;

        navigator.clipboard.writeText(outputText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        }).catch(err => {
            console.error("Failed to copy text:", err);
        });
    }, [outputText]);

    const handleClear = useCallback(() => {
        setInputText('');
    }, []);
    
    const handleSwapMode = useCallback(() => {
        setInputText(outputText);
        setMode(prev => prev === 'textToBinary' ? 'binaryToText' : 'textToBinary');
    }, [outputText]);

    const commonTextAreaClasses = "w-full bg-[#0d1117] text-[#c9d1d9] p-4 border border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#58a6ff] resize-none font-mono text-sm";

    const isTextToBinary = mode === 'textToBinary';

    return (
        <div className="flex flex-col min-h-screen bg-[#0d1117] text-gray-300">
            <Header />

            <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
                <div className="w-full max-w-4xl bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Input Section */}
                        <div className="flex flex-col h-full">
                             <div className="p-3 border-b border-[#30363d] flex justify-between items-center">
                                <h2 className="font-semibold text-gray-400 text-sm">{isTextToBinary ? 'Text Input' : 'Binary Input'}</h2>
                             </div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={isTextToBinary ? 'Type your text here...' : 'Enter binary, e.g., 01001000 01101001'}
                                className={`${commonTextAreaClasses} rounded-t-none md:rounded-l-lg md:rounded-r-none border-t-0 md:border-r-0 h-64 md:h-96`}
                                spellCheck="false"
                            />
                        </div>

                        {/* Output Section */}
                        <div className="flex flex-col h-full">
                            <div className="p-3 border-b border-t md:border-t-0 border-[#30363d] flex justify-between items-center">
                                <h2 className="font-semibold text-gray-400 text-sm">{isTextToBinary ? 'Binary Output' : 'Text Output'}</h2>
                                <div className="flex items-center gap-2">
                                     <ToolButton onClick={handleSwapMode} ariaLabel="Swap conversion direction">
                                        <SwapIcon className="w-5 h-5" />
                                    </ToolButton>
                                    {isCopied ? (
                                        <div className="flex items-center gap-1 text-sm text-green-400">
                                            <CheckIcon className="w-4 h-4" />
                                            <span>Copied!</span>
                                        </div>
                                    ) : (
                                        <ToolButton onClick={handleCopy} ariaLabel="Copy to clipboard">
                                            <ClipboardIcon className="w-5 h-5" />
                                        </ToolButton>
                                    )}
                                    <ToolButton onClick={handleClear} ariaLabel="Clear input">
                                        <TrashIcon className="w-5 h-5" />
                                    </ToolButton>
                                </div>
                            </div>
                            <textarea
                                value={outputText}
                                readOnly
                                placeholder={isTextToBinary ? '01001000 01100101 01101100 01101100 01101111' : 'Hello'}
                                className={`${commonTextAreaClasses} rounded-b-lg md:rounded-bl-none md:rounded-r-lg border-t-0 h-64 md:h-96`}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;