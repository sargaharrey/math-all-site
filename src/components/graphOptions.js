import React, { useState, useEffect } from 'react';

import functionPlot from 'function-plot'


import MathInput from "react-math-keyboard";
import Dropdown from './../components/other/dropdown';


import containsPattern from '../functions/Latex';
import  LatexToString from '../functions/LatexToString';

import ErrorModal from './other/errorModal';
const options = [
    { value: 'Scatter', label: 'Scatter' },
    { value: 'Polyline', label: 'Polyline' },
    { value: 'Interval', label: 'Interval' }
]



const GraphOptions = () => {


    const [secants, setSecants] = useState([]);
    const [annotations, setAnnotations] = useState([]);
    const [submited, setSubmited] = useState(false)
    const [selectedValue, setSelectedValue] = useState([])

    const [axisConfig, setAxisConfig] = useState({
        xAxis: {
            label: 'x - axis',
            domain: [-6, 6]
        },
        yAxis: {
            label: 'y - axis',
            domain: [-6, 6]
        }
    });


    const [functions, setFunctions] = useState([]);


    let contentsBounds = document.body.getBoundingClientRect();
    let width = 580;
    let height = 400;
    let ratio = contentsBounds.width / width;
    width *= ratio;
    height *= ratio;
    width = width / 1.3
    height = height / 1.3
    const [isModalOpen, setModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (index, key, value) => {



        const updatedFunctions = [...functions];
        if (!updatedFunctions[index]) {
            updatedFunctions[index] = {};
        }
     
        // const LatexToString = new latexToString(`"<div class='katex-html'>${value}</div>`)
       // Replace with your actual LaTeX string

        // Call the method and get the result
        // const resultString = LatexToString.renderToString();
        // const yy = LatexToString(value)
        // alert(yy)
        if(key === 'fn'){
        function replaceBracesWithParentheses(inputString) {
            if (inputString.includes('{') || inputString.includes('}')) {
                return inputString.replace(/{/g, '(').replace(/}/g, ')').replace('\\','');
            }
            return inputString;
        }

        const latexValue = containsPattern(value) && value.includes('{') === false ? LatexToString(value) : value;
        const finalValue = replaceBracesWithParentheses(latexValue);
        updatedFunctions[index][key] = finalValue
            console.log(latexValue)
        setFunctions(updatedFunctions);
    }
    else{
            updatedFunctions[index][key] = value

            setFunctions(updatedFunctions);
    }
    

    };

    const handleSecantInputChange = (index, key, value) => {
        const updatedSecants = [...secants];
        if (!updatedSecants[index]) {
            updatedSecants[index] = {};
        }
        updatedSecants[index][key] = value;
        setSecants(updatedSecants);
    };

    const handleAnnotationChange = (index, key, value) => {
        const updatedAnnotations = [...annotations];
        if (!updatedAnnotations[index]) {
            updatedAnnotations[index] = {};
        }
        updatedAnnotations[index][key] = value;
        setAnnotations(updatedAnnotations);
    };

    const handleAxisInputChange = (axis, key, value) => {

        const updatedConfig = { ...axisConfig };

        if (key === 'domainStart' || key === 'domainEnd') {
            const domainIndex = key === 'domainStart' ? 0 : 1;
            updatedConfig[axis].domain[domainIndex] = Number(value);
        } else {
            updatedConfig[axis][key] = value;
        }
      
        setAxisConfig(axisConfig);
    };

    const handleDropdownChange = (value, index) => {
        console.log("Selected Value:", value.value);
        setSelectedValue(value.value, () => {
            handleInputChange(index, 'graphType', selectedValue);
        });
        // Use the index here
    };



    function plotGraph() {

        try {

            const data = functions.map((item) => ({
                ...item,
                secants: secants  // Adding an empty secants array
            }));
       
            functionPlot({
                width,
                height,
                grid: true,
                target: '#graph',
                yAxis: axisConfig.yAxis,
                xAxis: axisConfig.xAxis,
                data: data,
                annotations

            });

        } catch (error) {
        
            setErrorMessage(`Check input data. ${error}`);
            setModalOpen(true);
        }
        setFunctions([])
        setAnnotations([])
        setSecants([])


        setSubmited(!submited)
    }
    return (
        <>
            <ErrorModal
                isOpen={isModalOpen}
                message={errorMessage}
                onClose={() => setModalOpen(false)}
            />
            <form className='graph-form' onSubmit={(e) => submited === true ? (e.preventDefault(), plotGraph()) : e.preventDefault()}>

                {/* X-Axis and Y-Axis Configuration */}
                <div styles={styles.inputs}>
                    <h4 style={{ margin: '20px 0px' }}>X-Axis Configuration</h4>
                    <label>
                        Domain Start: (-value)
                        <input type="number" onChange={(e) => handleAxisInputChange('xAxis', 'domainStart', e.target.value)} style={{ margin: '15px 0px' }} />
                    </label>
                    <label>
                        Domain End:(+value)
                        <input type="number" onChange={(e) => handleAxisInputChange('xAxis', 'domainEnd', e.target.value)} style={{ margin: '15px 0px' }} />
                    </label>

                    <h4 style={{ margin: '20px 0px' }}>Y-Axis Configuration</h4>
                    <label>
                        Domain Start:  (-value)
                        <input type="number" onChange={(e) => handleAxisInputChange('yAxis', 'domainStart', e.target.value)} style={{ margin: '15px 0px' }} />
                    </label>
                    <label>
                        Domain End: (+value)
                        <input type="number" onChange={(e) => handleAxisInputChange('yAxis', 'domainEnd', e.target.value)} style={{ margin: '15px 0px' }} />
                    </label>
                </div>

                <hr />

                {/* end axsis inputs */}

                {/* annotations Configuration */}

                <div>
                    {annotations.map((annotation, index) => (
                        <div key={index}>
                            <span style={{ display: 'flex' }}>x:</span>
                            <input
                                type="number"
                                value={annotation.x || ''}
                                onChange={(e) => handleAnnotationChange(index, 'x', Number(e.target.value))}
                                style={{ margin: '10px 0px' }}
                            />

                            <span style={{ marginTop: '20px', display: 'flex' }}>y:</span>
                            <input
                                type="number"
                                value={annotation.y || ''}
                                onChange={(e) => handleAnnotationChange(index, 'y', Number(e.target.value))}
                                style={{ margin: '10px 0px' }}
                            />

                            <span style={{ marginTop: '20px', display: 'flex' }}>Text:</span>
                            <input
                                type="text"
                                value={annotation.text || ''}
                                onChange={(e) => (e.preventDefault(), handleAnnotationChange(index, 'text', e.target.value))}
                                style={{ margin: '10px 0px' }}
                            />
                        </div>
                    ))}
                    <button style={styles.submit} onClick={(e) => (e.preventDefault(), setAnnotations([...annotations, {}]))}>Add Annotation</button>
                </div>

                {/* annotations end */}
                {/* Functions with Secants */}
                <hr />

                <div style={styles.inputs}>

                    <>
                        {functions.map((func, index) => (
                            <div key={index} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

                                <span style={{ marginTop: '20px', display: 'flex' }}>Fn</span>
                                <MathInput
                                    value={func.fn}
                                    setValue={(latexString) => handleInputChange(index, 'fn', latexString)}
                                    type={'string'}

                                />
                                <span style={{ marginTop: '20px', display: 'flex' }}>GraphType</span>

                                <Dropdown

                                    placeHolder="Select..."
                                    options={options}
                                    onChange={(value) => handleDropdownChange(value, index)}
                                // onChange={(e) => handleInputChange(index, 'graphType',value)}
                                />
                                {/* <Select options={options} /> */}
                                <span style={{ marginTop: '20px', display: 'flex' }}>Nsamples</span>
                                <input
                                    type="number"
                                    placeholder="nSamples"
                                    value={func.nSamples || ''}
                                    className={styles.inputs}
                                    onChange={(e) => handleInputChange(index, 'nSamples', Number(e.target.value))}
                                    style={{ marginBottom: '20px' }}
                                />

                                <div>

                                    <h3>secants</h3>
                                    {secants.map((secant, index) => (
                                        <div key={index} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            <span>x0</span>
                                            <input
                                                type="number"
                                                value={secant.x0 || ''}
                                                onChange={(e) => handleSecantInputChange(index, 'x0', Number(e.target.value))}
                                            />

                                            <span>x1</span>
                                            <input
                                                type="number"
                                                value={secant.x1 || ''}
                                                onChange={(e) => handleSecantInputChange(index, 'x1', Number(e.target.value))}
                                            />
                                        </div>
                                    ))}
                                    <button style={styles.submit} onClick={(e) => (e.preventDefault(), setSecants([...secants, { x0: '', x1: '' }]))}>Add Secant</button>
                                </div>


                            </div>
                        ))}
                    </>


                    <button style={styles.submit} onClick={(e) => (e.preventDefault(), setFunctions([...functions, {}]))}>Add Function</button>
                </div>

                {/* End Functions with Secants */}
                {/* Form  submit */}
                <button style={styles.submit} onClick={() => setSubmited(true)} type='submit'>Plot Graph</button>


            </form>
        </>
    )
}
const styles = {
    sidebarLight: {
        width: '350px',
        backgroundColor: '#fff',
        color: '#222',
        padding: '20px',
        transition: 'all 0.3s',
        zIndex: '2',

        minHeight: '100vh'
    },
    sidebarDark: {
        width: '350px',
        backgroundColor: '#222',
        color: '#fff',
        padding: '20px',
        transition: 'all 0.3s',
        zIndex: '2',

        minHeight: '100vh'
    },
    themeToggle: {
        cursor: 'pointer',
        padding: '10px 15px',
        backgroundColor: '#444',
        borderRadius: '5px',
        transition: 'background-color 0.2s',

        width: '50px',
        height: '50px',

        ':hover': {
            backgroundColor: '#555',
        },
    },
    graph: {
        cursor: 'pointer',
        padding: '10px 15px',
        backgroundColor: '#444',
        borderRadius: '5px',
        transition: 'background-color 0.2s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        margin: '20px 0px',
        ':hover': {
            backgroundColor: '#555',
        },
    },

    submit: {
        cursor: 'pointer',
        padding: '10px 15px',
        backgroundColor: '#444',
        borderRadius: '5px',
        transition: 'background-color 0.2s',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: '20px 0px',
        textAlign: 'center',
        ':hover': {
            backgroundColor: '#555',
        },
    },
    sidebarMobileClosed: {
        width: '0px',
        transition: 'all 0.3s',

        position: 'fixed',
        top: 0,
        left: '-350px',
        height: '100%',
        zIndex: 1000,

    },
    sidebarMobileOpen: {
        width: '350px',
        backgroundColor: '#222',
        color: '#fff',
        padding: '20px',
        transition: 'all 0.3s',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        zIndex: 1000,
    },
    sidebarLogo: {
        fontSize: '24px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dropdownToggle: {
        cursor: 'pointer',
        padding: '10px 15px',
        backgroundColor: '#444',
        borderRadius: '5px',
        transition: 'background-color 0.2s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        ':hover': {
            backgroundColor: '#555',
        },
    },
    dropdownList: {
        maxHeight: '50vh',
        overflow: 'auto',
    },
    dropdownGraphLis: {

        overflow: 'auto',           // Allows the content to scroll
        maxHeight: '75vh',          // Set a maximum height
    },

    listItem: {
        padding: '8px 0',
        listStyleType: 'none',
        cursor: 'pointer',
        display: 'flex',            // Set this to flex
        alignItems: 'center',       // This will vertically align the items in the middle
        margin: '20px 0px',
        cursor: 'pointer'
    },
    listGraphItem: {
        marginTop: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        cursor: 'pointer'
    },
    icon: {                         // New style for the icon
        marginRight: '10px',
        display: 'inline'     // This adds spacing to the right of the icon
    },
    inputs: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '15px',
        width: '100%'
    },
    domain: {
        display: 'flex',
        flexDirection: 'column',

        input: {
            gap: '15px',
            marginTop: '15px',

            ':active': {
                border: '1px solid #ccc !important'
            },
            ':focus': {
                border: '2px solid #ccc!important'
            }
        }
    }

};
export default GraphOptions