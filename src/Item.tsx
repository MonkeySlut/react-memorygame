import React from 'react';
import './Item.css';

interface Props {
    isFlipped: boolean;
    onClick: () => void;
    imageId: number | void;
    canFlip: boolean;
}

const Item: React.FC<Props> = ({ isFlipped, onClick, imageId, canFlip}) => {
    const classIsClickable = canFlip ? 'item-clickable' : '';
    return (
        <div onClick={onClick} className={`item ${classIsClickable}`}>
            {isFlipped && <img src={`https://www.memozor.com/jeux/jquery/objects_diy/image${imageId}.jpg`} alt={`image_${imageId}`} />}
        </div>
    );
}

export default Item;
