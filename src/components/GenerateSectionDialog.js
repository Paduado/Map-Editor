import * as React from 'react'
import PropTypes from 'prop-types'
import Dialog from "./Dialog";
import Input from "./Input";
import RadioButtonGroup, {RadioButton} from "./RadioButtonGroup";
import Button from "./Button";

const getStart = (type, order) => {
    if(type === 1 && order === 'asc')
        return 1;
    if(type === 1 && order === 'desc')
        return 99;
    if(type === 2 && order === 'asc')
        return 'A';
    if(type === 2 && order === 'desc')
        return 'Z';
    if(type === 3 && order === 'asc')
        return 'a';
    if(type === 3 && order === 'desc')
        return 'z';
    return ''
};
const labelTypes = [{
    value: 1,
    label: '1,2,3...'
}, {
    value: 2,
    label: 'A,B,C...'
}, {
    value: 3,
    label: 'a,b,c...'
}];

const orders = [{
    value: 'asc',
    label: 'Ascendente'
}, {
    value: 'desc',
    label: 'Descendente'
}];

export default class GenerateSectionDialog extends React.PureComponent {
    static propTypes = {
        ...Dialog.propTypes,
        onSuccess: PropTypes.func.isRequired
    };

    state = {
        rows: 10,
        cols: 10,
        rowsLabelType: labelTypes[1].value,
        colsLabelType: labelTypes[0].value,
        rowsOrder: orders[0].value,
        colsOrder: orders[0].value,
        rowsStart: 'A',
        colsStart: 1,
    };

    onRowsLabelTypeChange = rowsLabelType => this.setState(({rowsOrder}) => ({
        rowsLabelType,
        rowsStart: getStart(rowsLabelType, rowsOrder)
    }));

    onRowsOrderChange = rowsOrder => this.setState(({rowsLabelType}) => ({
        rowsOrder,
        rowsStart: getStart(rowsLabelType, rowsOrder)
    }));

    onColsLabelTypeChange = colsLabelType => this.setState(({colsOrder}) => ({
        colsLabelType,
        colsStart: getStart(colsLabelType, colsOrder)
    }));

    onColsOrderChange = colsOrder => this.setState(({colsLabelType}) => ({
        colsOrder,
        colsStart: getStart(colsLabelType, colsOrder)
    }));

    generate = () => {
        const {onSuccess} = this.props;
        const {
            rows,
            cols,
            rowsLabelType,
            colsLabelType,
            rowsOrder,
            colsOrder,
            rowsStart,
            colsStart
        } = this.state;
        onSuccess({
            rows,
            cols,
            rowsLabelType,
            colsLabelType,
            rowsOrder,
            colsOrder,
            rowsStart,
            colsStart
        })
    };


    render() {
        const {style, ...props} = this.props;
        const {
            rows,
            cols,
            rowsLabelType,
            colsLabelType,
            rowsOrder,
            colsOrder,
            rowsStart,
            colsStart
        } = this.state;
        const styles = {
            dialog: {
                width: 600,
                maxWidth: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))',
                gridGap: 20,
                padding: '10px 20px',
                ...style
            },
            header: {
                gridColumn: '1 / -1',
                margin: '10px 0',
                fontWeight: 600,
                textAlign: 'center'
            },
            subHeader: {
                gridColumn: '1 / -1',
                margin: 0,
                fontWeight: 600
            },
            button: {
                gridColumn: '1 / -1',
                justifySelf: 'end',
                margin: 0
            }
        };
        return (
            <Dialog {...props} style={styles.dialog}>
                <h2 style={styles.header}>Generar sección</h2>
                <h3 style={styles.subHeader}>Filas</h3>
                <Input
                    label="Número de filas"
                    type="number"
                    style={{width: 100}}
                    value={rows}
                    onChange={(e, rows) => this.setState({rows})}
                />
                <RadioButtonGroup
                    label="Tipo de etiquetas"
                    value={rowsLabelType}
                    onChange={this.onRowsLabelTypeChange}
                >
                    {labelTypes.map(({value, label}) => (
                        <RadioButton
                            key={value}
                            value={value}
                            children={label}
                        />
                    ))}
                </RadioButtonGroup>
                <RadioButtonGroup
                    label="Orden"
                    value={rowsOrder}
                    onChange={this.onRowsOrderChange}
                >
                    {orders.map(({value, label}) => (
                        <RadioButton
                            key={value}
                            value={value}
                            children={label}
                        />
                    ))}
                </RadioButtonGroup>
                <Input
                    label="Empezar con"
                    style={{width: 100}}
                    value={rowsStart}
                    onChange={(e, rowsStart) => this.setState({rowsStart})}
                />
                <h3 style={styles.subHeader}>Columnas</h3>
                <Input
                    label="Número de columnas"
                    type="number"
                    style={{width: 100}}
                    value={cols}
                    onChange={(e, cols) => this.setState({cols})}
                />
                <RadioButtonGroup
                    label="Tipo de etiquetas"
                    value={colsLabelType}
                    onChange={this.onColsLabelTypeChange}
                >
                    {labelTypes.map(({value, label}) => (
                        <RadioButton
                            key={value}
                            value={value}
                            children={label}
                        />
                    ))}
                </RadioButtonGroup>
                <RadioButtonGroup
                    label="Orden"
                    value={colsOrder}
                    onChange={this.onColsOrderChange}
                >
                    {orders.map(({value, label}) => (
                        <RadioButton
                            key={value}
                            value={value}
                            children={label}
                        />
                    ))}
                </RadioButtonGroup>
                <Input
                    label="Empezar con"
                    style={{width: 100}}
                    value={colsStart}
                    onChange={(e, colsStart) => this.setState({colsStart})}
                />
                <Button
                    style={styles.button}
                    label="Generar"
                    onClick={this.generate}
                />
            </Dialog>
        )
    }
}