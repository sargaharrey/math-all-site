import React, { useState } from 'react';
import * as math from 'mathjs';

function MathParser() {
    const [latex, setLatex] = useState('');
    const [result, setResult] = useState('');

    const handleLatexChange = (e) => {
        setLatex(e.target.value);
    };

    const parseLatex = () => {
        try {
            const parsedResult = math.evaluate(math.parse(math.latexToMathML(latex)));
            setResult(parsedResult.toString());
        } catch (error) {
            setResult('Invalid LaTeX expression.');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={latex}
                onChange={handleLatexChange}
                placeholder="Enter LaTeX expression"
            />
            <button onClick={parseLatex}>Parse</button>
            <div>Result: {result}</div>
        </div>
    );
}

export default MathParser;
