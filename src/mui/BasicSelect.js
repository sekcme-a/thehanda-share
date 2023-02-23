import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


//**(제목, 사이즈(small, medium), width(int),  아이템들, 선택된아이템, 선택된아이템제어useState) */
export default function BasicSelect({title, size, width, items, selectedItem, handleSelectedItem}) {

  const handleChange = (event) => {
    handleSelectedItem(event.target.value);
  };

  return (
    <Box sx={{width: width}}>
      <FormControl fullWidth size={size}>
        <InputLabel id="demo-simple-select-label">{title}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedItem}
          label={title}
          onChange={handleChange}
        >
          {items.map((item, index) => {
            return(
              <MenuItem value={item.value} key={index}>{item.text}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </Box>
  );
}