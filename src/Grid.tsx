import React, { useState, useEffect, useCallback } from 'react';
import produce from 'immer';
import './Grid.css';
import Item from './Item';

// could have used uuid / lodash _.sample - I wanted to be able to not hide implementation
function* imageIdMaker(totalItems: number) {
    const idPool = Array(totalItems / 2).fill(null).map((_, i) => i);
    let imageIds = idPool.concat(idPool);
    while (imageIds.length > 0) {
        const randomIndex = Math.floor(Math.random() * imageIds.length);
        yield imageIds[randomIndex];
        imageIds.splice(randomIndex, 1);
    }
}

type itemProps = React.ComponentProps<typeof Item>;
type gridState = Omit<itemProps, 'onClick'>;
type itemPos = [number, number];

interface Props {
    row?: number;
    col?: number;
    onSuccessfulMatch: () => void;
    onFailedMatch: () => void;
    onAllMatched: () => void;
}

const Grid: React.FC<Props> = ({ row = 6, col = 5, onSuccessfulMatch, onFailedMatch, onAllMatched }) => {
    const totalItems = row * col;
    const imageIdGenerator = imageIdMaker(totalItems);
    const [matchedCount, setMatchedCount] = useState(0);
    const [grid, setGrid] = useState<gridState[][]>(Array(row).fill(null).map(
        () => Array(col).fill(null).map(
            () => ({ isFlipped: false, imageId: imageIdGenerator.next().value, canFlip: true })
        )
    ));

    const [firstItemPos, setfirstItemPos] = useState<itemPos>();
    const [secondItemPos, setSecondItemPos] = useState<itemPos>();

    const setCanFlip = ([i, j]: itemPos, value: boolean) => {
        setGrid(prevGrid => produce(prevGrid, gridState => {
            gridState[i][j].canFlip = value;
        }));
    };

    const setIsFlipped = ([i, j]: itemPos, value: boolean) => {
        setGrid(prevGrid => produce(prevGrid, gridState => {
            gridState[i][j].isFlipped = value;
        }));
    };

    const itemOnClick = (itemPos: itemPos) => () => {
        const [i, j] = itemPos;
        if (!grid[i][j].canFlip)
            return;

        if (firstItemPos) {
            setSecondItemPos(itemPos);
        } else {
            setfirstItemPos(itemPos);
        }

        setCanFlip(itemPos, false);
        setIsFlipped(itemPos, true);
    };

    const foundMatchingItems = useCallback(() => {
        setCanFlip(firstItemPos!, false);
        setCanFlip(secondItemPos!, false);
        setIsFlipped(firstItemPos!, true);
        setIsFlipped(secondItemPos!, true);
        setfirstItemPos(undefined);
        setSecondItemPos(undefined);
        setMatchedCount(prevMatchedCount => prevMatchedCount + 2);
        onSuccessfulMatch();
    }, [firstItemPos, secondItemPos, onSuccessfulMatch]);

    const failedFindingMatchingItems = useCallback(() => {
        setCanFlip(firstItemPos!, false);
        setCanFlip(secondItemPos!, false);

        setTimeout(() => {
            setCanFlip(firstItemPos!, true);
            setCanFlip(secondItemPos!, true);
            setIsFlipped(firstItemPos!, false);
            setIsFlipped(secondItemPos!, false);
        }, 1500);

        setfirstItemPos(undefined);
        setSecondItemPos(undefined);
        onFailedMatch();
    }, [firstItemPos, secondItemPos, onFailedMatch]);

    const checkItemsImageIdEqual = useCallback(([i, j]: itemPos, [i2, j2]: itemPos) => {
        return grid[i][j].imageId === grid[i2][j2].imageId;
    }, [grid]);

    useEffect(() => {
        if (firstItemPos && secondItemPos) {
            if (checkItemsImageIdEqual(firstItemPos, secondItemPos)) {
                foundMatchingItems();
            } else {
                failedFindingMatchingItems();
            }
        }
    }, [firstItemPos, secondItemPos, checkItemsImageIdEqual, foundMatchingItems, failedFindingMatchingItems]);

    useEffect(() => {
        if (matchedCount === totalItems) {
          onAllMatched();
        }
      }, [totalItems, matchedCount, onAllMatched])

    return (
        <div className="grid">
            {grid.flatMap((list, row) => list.map((item, col) => <Item key={`${row}-${col}`} {...item} onClick={itemOnClick([row, col])} />))}
        </div>
    );
}

export default Grid;
