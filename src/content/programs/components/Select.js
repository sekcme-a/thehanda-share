import {useState} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

//items = [{value:, text:,}]
//style={width:""}
export default function BasicSelect({title, items, value, handleChange, style, helperText}) {
 
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl>
        <InputLabel id="demo-simple-select-label">{title}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={title}
          sx={{width: style.width}}
          onChange={handleChange}
          helperText={helperText}
        >
          {items.map((item, index) => {
            return (
              <MenuItem value={item.value} key={index}>{item.text}</MenuItem>
            )
          })}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </Box>
  );
}