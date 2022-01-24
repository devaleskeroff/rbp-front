import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > .MuiFormControl-root': {
            marginTop: theme.spacing(3),
            width: '100%'
        },
        '& .MuiFormControl-root': {
          marginTop: theme.spacing(3)
        },
        '& .MuiInput-formControl': {
            minHeight: '55px',
            paddingLeft: '10px'
        },
        '& div.MuiInputBase-formControl': {
            backgroundColor: '#F5F6FA',
            borderRadius: '5px',
            overflowX: 'hidden'
        },
        '& .MuiFilledInput-underline:before': {
            border: 'none'
        },
        '& .MuiFilledInput-underline:after': {
            borderBottomColor: '#00B856'
        },
        '& .MuiInput-formControl:after': {
            borderBottomColor: '#00B856'
        },
        '& label.Mui-focused': {
            color: '#00B856'
        }
    },
    signing: {
        '& div.MuiInputBase-formControl': {
            backgroundColor: '#fff',
            borderRadius: '5px',
            overflowX: 'hidden'
        }
    },
    // chips: {
    //     display: 'flex',
    //     flexWrap: 'wrap'
    // },
    // chip: {
    //     marginRight: 2,
    //     marginBottom: 5,
    // },
}))

export default useStyles