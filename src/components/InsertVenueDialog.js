import * as React from 'react'
import PropTypes from 'prop-types'
import Dialog from "./Dialog";
import {green} from "../utils/colors";
import {BaseballField, FootballField} from "./svgs";
import Radium from "radium";

const InsertVenueDialog = ({onInsert, ...props})=>{
    const styles = {
        dialog: {
            width: '100%',
            maxWidth: 500
        },
        header: {
            fontWeight: 'normal'
        },
        body: {
            display: 'flex',
            justifyContent: 'center'
        },
        svg: {
            width: '100%',
            height: '100%'
        },
        button: {
            marginLeft: 'auto',
            display: 'block'
        }
    };
    return (
        <Dialog
            {...props}
            style={styles.dialog}
        >
            <h3 style={styles.header}>
                Elige el tipo de estadio
            </h3>
            <div style={styles.body}>
                <VenueOption
                    venue={<FootballField style={styles.svg}/>}
                    onClick={() => onInsert('football')}
                />
                <VenueOption
                    venue={<BaseballField style={styles.svg}/>}
                    onClick={() => onInsert('baseball')}
                />
            </div>
        </Dialog>
    )
};

InsertVenueDialog.propTypes = {
    ...Dialog.propTypes,
    onInsert: PropTypes.func.isRequired
};

export default InsertVenueDialog

const VenueOption = Radium(({venue, ...props}) => {
    const styles = {
        container: {
            width: 150,
            height: 150,
            padding: 10,
            borderRadius: 3,
            margin: 15,
            cursor: 'pointer',
            transition: 'all 100ms',
            border: `2px solid #ddd`,
            ':hover': {
                border: `2px solid ${green}`,
            }
        }
    };
    return (
        <div
            {...props}
            style={styles.container}
        >
            {venue}
        </div>
    )
});