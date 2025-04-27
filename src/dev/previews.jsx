import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import SidebarContratante from "../utils/sideBarContratanate.jsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/SidebarContratante">
                <SidebarContratante/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews