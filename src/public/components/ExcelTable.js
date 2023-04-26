import { useState } from 'react'
import { Table, Input, Button } from 'antd'
// import XLSX from 'xlsx'
// import { XLSX$Utils } from 'xlsx'

const ExcelTable = ({ columns, rows }) => {
  const [filteredRows, setFilteredRows] = useState(rows)

  const handleFilter = (e) => {
    const { value } = e.target
    const filteredData = rows.filter((row) => {
      return Object.values(row).some((cellValue) => {
        return cellValue.toString().toLowerCase().includes(value.toLowerCase())
      })
    })
    setFilteredRows(filteredData)
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, 'table.xlsx')
  }

  const tableColumns = columns.map((column) => {
    return {
      title: column.label,
      dataIndex: column.key,
      key: column.key,
    }
  })

  return (
    <div>
      <Input placeholder="Filter table" onChange={handleFilter} style={{ marginBottom: 10 }} />
      <Button onClick={exportToExcel} style={{ marginBottom: 10 }}>
        Export to Excel
      </Button>
      <Table columns={tableColumns} dataSource={filteredRows} />
    </div>
  )
}

export default ExcelTable
