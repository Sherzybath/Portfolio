import React, { useState } from 'react';
import { onShakeAnimation } from '../../Commands';
const CommandInputBox = ({ commands, compilerRef }) => {
    const [inputValue, setInputValue] = useState('');
    const [placeholder, setPlaceholder] = useState('Type /help');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const command = inputValue.trim().toLowerCase();
            const compilersElement = document.querySelector('.compiler');

            if (commands[command]) {
                commands[command](); 
                setPlaceholder('Type /help');
            } else {
                setPlaceholder('Incorrect syntax');
                if (compilersElement) {
                    onShakeAnimation(compilerRef)
                }
            }
            setInputValue('');
        }
    };

    return (
        <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className='Input'
            onFocus={() => setPlaceholder('Type /help')}
        />
    );
};

export default CommandInputBox;
