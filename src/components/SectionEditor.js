import * as React from 'react'
import PropTypes from 'prop-types'
import Menu from "./Menu";
import {seatType} from "../utils/types";
import {green} from "../utils/colors";


const getCodeLabel = (offset, startLabel) => {
    if(!isNaN(Number(startLabel)))
        return Number(startLabel) + offset;
    else
        return startLabel.replace(/.$/, c => {
            return String.fromCharCode(c.charCodeAt(0) + offset)
        });
};

const LETTERS_SPACE = 50;
const CIRCLE_WIDTH = .7;

const onSeatClick = (index, selected) => ({selectedIndexes}) => ({
    selectedIndexes: selected
        ? selectedIndexes.filter(i => i !== index)
        : selectedIndexes.concat(index)
});


export default class SectionEditor extends React.PureComponent {
    static propTypes = {};

    state = {
        rows: 10,
        columns: 10,
        colStartLabel: 1,
        rowStartLabel: 'A',
        circles: [],
        rowLabels: [],
        selectedIndexes: [],
        viewBox: '0 0 1000 1000',
        menuOpen: false,
        menuX: 0,
        menuY: 0,
    };

    generate = () => this.setState(({rows, columns, rowStartLabel, colStartLabel}) => {
        const step = 1000 / Math.max(rows, columns);
        const circles = [];
        const rowLabels = [];
        for(let row = 0; row < rows; row++) {
            rowLabels.push({
                row: getCodeLabel(row, rowStartLabel),
                y: step * (row + .5) + 5
            });
            for(let col = 0; col < columns; col++) {
                circles.push({
                    x: step * (col + .5) + LETTERS_SPACE,
                    y: step * (row + .5),
                    radium: step / 2 * CIRCLE_WIDTH,
                    row: getCodeLabel(row, rowStartLabel),
                    col: getCodeLabel(col, colStartLabel)
                })
            }
        }
        return {
            circles,
            rowLabels,
            viewBox: `0 0 ${Math.min(columns / rows * 1000, 1000) + LETTERS_SPACE} ${Math.min(rows / columns * 1000, 1000)}`
        }
    });

    onCircleContextMenu = (e, index, selected) => {
        e.preventDefault();
        const {clientX, clientY} = e;
        this.setState(({selectedIndexes}) => ({
            menuOpen: true,
            menuX: clientX,
            menuY: clientY,
            ...(!selected && {
                selectedIndexes: selectedIndexes.concat(index)
            })
        }));
    };

    onRowChange = () => {
        const row = window.prompt('Ingresa la fila');
        this.setState(({circles, selectedIndexes}) => ({
            circles: circles.map((circle, i) => !selectedIndexes.includes(i)
                ? circle
                : {
                    ...circle,
                    row
                })
        }))
    };

    onColChange = () => {
        const col = window.prompt('Ingresa la columna');
        this.setState(({circles, selectedIndexes}) => ({
            circles: circles.map((circle, i) => !selectedIndexes.includes(i)
                ? circle
                : {
                    ...circle,
                    col
                })
        }))
    };

    onDelete = () => this.setState(({circles, selectedIndexes}) => ({
        circles: circles.filter((_, i) => !selectedIndexes.includes(i)),
        selectedIndexes: []
    }));


    render() {
        const {
            rows,
            columns,
            rowStartLabel,
            colStartLabel,
            circles,
            rowLabels,
            viewBox,
            menuOpen,
            menuX,
            menuY,
            selectedIndexes
        } = this.state;
        const styles = {
            svg: {
                width: '100%',
                height: '700px',
                border: '1px solid #ddd',
                display: 'block'
            }
        };

        return (
            <div>
                <input value={rows} placeholder="filas" type="number" onChange={e => this.setState({rows: Number(e.target.value)}, this.generate)}/>
                <input value={columns} placeholder="columnas" type="number" onChange={e => this.setState({columns: Number(e.target.value)}, this.generate)}/>
                <input value={rowStartLabel} placeholder="Inicio filas" onChange={e => this.setState({rowStartLabel: e.target.value})}/>
                <input value={colStartLabel} placeholder="Inicio columnas" onChange={e => this.setState({colStartLabel: e.target.value})}/>
                <button onClick={this.generate}>Generar</button>
                <svg style={styles.svg} viewBox={viewBox}>
                    {rowLabels.map(({row, y}) => (
                        <text
                            key={row}
                            x={20}
                            y={y}
                            style={{fontSize: '1.2rem'}}
                            fontFamily="Proxima Nova"
                        >
                            {row}
                        </text>
                    ))}
                    {circles.map((circle, i) => {
                        const selected = selectedIndexes.includes(i);
                        return (
                            <Seat
                                key={i}
                                seat={circle}
                                onContextMenu={e => this.onCircleContextMenu(e, i, selected)}
                                onClick={() => this.setState(onSeatClick(i, selected))}
                                selected={selected}
                            />
                        )
                    })}
                </svg>
                <Menu
                    open={menuOpen}
                    onClose={() => this.setState({menuOpen: false})}
                    x={menuX}
                    y={menuY}
                    options={[{
                        label: 'Cambiar fila',
                        onClick: this.onRowChange
                    }, {
                        label: 'Cambiar asiento',
                        onClick: this.onColChange
                    }, {
                        label: 'Eliminar',
                        onClick: this.onDelete
                    }]}
                />
            </div>
        )
    }
}

const Seat = ({seat, selected, ...props}) => {
    const {row, col, x, y, radium} = seat;
    const code = `${row}-${col}`;
    const styles = {
        circle: {
            cursor: 'pointer',
            fill: '#444',
            stroke: green,
            strokeWidth: selected ? 5 : 0,
            transition: 'all 50ms'
        },
        label: {
            fill: 'white',
            fontSize: radium / 2,
            lineHeight: radium / 2,
            fontFamily: 'Proxima Nova',
            pointerEvents: 'none',
            textAnchor: 'middle'
        }
    };
    return (
        <React.Fragment key={code}>
            <circle
                {...props}
                id={code}
                cx={x}
                cy={y}
                r={radium}
                style={styles.circle}
            />
            <text
                x={x}
                y={y + radium / 5}
                style={styles.label}
            >
                {code}
            </text>
        </React.Fragment>
    )
};

Seat.propTypes = {
    seat: seatType.isRequired,
    selected: PropTypes.bool
};