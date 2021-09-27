import styles from './Editor.module.scss';
import {Image, Layer, Rect, Stage} from "react-konva";
import {useRef, useState} from "react";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

interface StageState {
    scale: number;
    x: number;
    y: number;
}

const Editor = () => {
    const [img, setImg] = useState<any>(null);
    const imgRef = useRef<Konva.Image | null>(null);
    const stageRef = useRef<Konva.Stage | null>(null);

    const [stage, setStage] = useState<StageState>({
        scale: 1,
        x: 0,
        y: 0
    });

    const onFileChange = (files: FileList | null) => {
        if (!files) {
            return;
        }
        const reader = new FileReader();
        const file = files[0];
        const imgNode = document.createElement('img');

        reader.onloadend = function (e) {
            if (typeof reader.result === "string") {
                imgNode.src = reader.result;
            }
            setImg(imgNode);
            imgNode.remove();
        }

        reader.readAsDataURL(file)
    }

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();

        const scaleBy = 1.1;
        const stage = e.target.getStage() as Konva.Stage;
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition()!.x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition()!.y / oldScale - stage.y() / oldScale
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        setStage({
            scale: newScale,
            x: (stage.getPointerPosition()!.x / newScale - mousePointTo.x) * newScale,
            y: (stage.getPointerPosition()!.y / newScale - mousePointTo.y) * newScale
        });
    };

    return <div className={styles.root}>
        <input type="file" multiple={false} onChange={(e) => onFileChange(e.target.files)}/>
        <Stage onWheel={handleWheel} x={stage.x} y={stage.y} scaleX={stage.scale} scaleY={stage.scale} ref={stageRef}
               width={window.innerWidth - 40} height={window.innerHeight - 100}>
            <Layer>
                {img && <Image ref={imgRef} image={img} draggable/>}
                <Rect x={0} y={0} width={200} height={50} fill={"red"} />
            </Layer>
        </Stage>
    </div>
}

export default Editor