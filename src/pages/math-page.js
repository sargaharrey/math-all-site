import Sidebar from "../components/sidebar"
import View from '../components/chat.js';
import { useState } from 'react';
function Math(props) {
    const [current, setCurrent] = useState('')
   
return(
    <>
        <Sidebar current={current} setCurrent={setCurrent} setTheme={props.setTheme} Graph={false} />
        <View current={current} theme={props.theme}></View>
    </>
)

}

export default Math