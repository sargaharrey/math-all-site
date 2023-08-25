import Sidebar from "../components/sidebar"
import GraphComponent from '../components/graph';
import { useState } from 'react';
function Graph() {
    const [current, setCurrent] = useState('')
    const [theme, setTheme] = useState('light')
    return (
        <>
            <Sidebar current={current} setCurrent={setCurrent} setTheme={setTheme} Graph={true} />
            <GraphComponent theme={theme} />
        </>
    )

}

export default Graph