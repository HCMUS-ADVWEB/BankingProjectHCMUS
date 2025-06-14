# Hướng Dẫn Sử Dụng Theme với Material-UI (MUI) trong Dự Án

## 1. Giới thiệu

Theme trong dự án được quản lý qua `ThemeContext.js`, sử dụng `@mui/material/styles` để định nghĩa các thuộc tính giao diện như màu sắc (palette), kiểu chữ (typography), hình dạng (shape), và style tùy chỉnh cho các component MUI (components). Theme hỗ trợ cả chế độ tối (dark) và sáng (light), có thể chuyển đổi thông qua hook `useTheme`.

**Tài liệu này hướng dẫn cách:**

- Tích hợp theme vào ứng dụng
- Sử dụng các component MUI với theme
- Tùy chỉnh và mở rộng theme khi cần

## 2. Cài đặt

### 2.1. Yêu cầu

Đảm bảo các thư viện sau đã được cài đặt:

```bash
npm install @mui/material @mui/styles @mui/icons-material @mui/lab @mui/x-date-pickers @mui/x-charts
```

### 2.2. Tích hợp ThemeProvider

Wrap toàn bộ ứng dụng bằng `ThemeProvider` từ `ThemeContext.js` trong file `index.js`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/output.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
```

### 2.3. Sử dụng hook useTheme

Trong các component, sử dụng hook `useTheme` để truy cập theme và chuyển đổi chế độ:

```javascript
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@mui/material';

function MyComponent() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} color="primary">
      Chuyển sang {isDarkMode ? 'Light' : 'Dark'} Mode
    </Button>
  );
}
```

## 3. Cấu trúc Theme

Theme được định nghĩa trong `ThemeContext.js` với các phần chính:

### 3.1. Palette (Màu sắc)

- `background.default`: Màu nền chính (`#0f172a` tối, `#f5f5f5` sáng)
- `background.paper`: Màu nền cho Paper, Card (`#1e293b` tối, `#ffffff` sáng)
- `primary.main`: Màu chính (`#10b981`) cho nút, liên kết
- `secondary.main`: Màu phụ (`#06b6d4`) cho nút thứ cấp
- `text.primary`: Màu chữ chính (`#ffffff` tối, `#111827` sáng)
- `text.secondary`: Màu chữ phụ (`#d1d5db` tối, `#4b5563` sáng)
- `divider`: Màu đường phân cách (`rgba(255,255,255,0.1)` tối, `rgba(0,0,0,0.12)` sáng)

### 3.2. Typography

Định nghĩa font (Inter), trọng lượng, màu sắc cho các kiểu chữ (h1, body1, v.v.)

### 3.3. Shape

Định nghĩa `borderRadius` (12px) cho các component

### 3.4. Components

Override style mặc định cho các component MUI (như MUIButton, MUICard)

## 4. Sử dụng Component MUI với Theme

### 4.1. Container và Grid

**Mục đích:** Tạo bố cục responsive

```javascript
import { Container, Grid, Box, Typography } from '@mui/material';

<Container maxWidth="xl" sx={{ bgcolor: 'background.default', p: 3 }}>
  <Grid container spacing={3}>
    <Grid item xs={12} sm={6}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 'shape.borderRadius',
        }}
      >
        <Typography variant="h6" color="primary.main">
          Cột 1
        </Typography>
      </Box>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 'shape.borderRadius',
        }}
      >
        <Typography variant="h6" color="primary.main">
          Cột 2
        </Typography>
      </Box>
    </Grid>
  </Grid>
</Container>;
```

### 4.2. Typography

**Mục đích:** Hiển thị văn bản với các kiểu chữ định sẵn

```javascript
import { Typography } from '@mui/material';

<Typography variant="h1">Tiêu đề chính</Typography> {/* Gradient emerald-cyan */}
<Typography variant="body1" color="text.secondary">Văn bản phụ</Typography>
```

### 4.3. Button, IconButton, Fab

**Mục đích:** Tạo nút tương tác

```javascript
import { Button, IconButton, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

<Button variant="contained" color="primary">
  Nút chính
</Button> {/* Gradient emerald-cyan */}

<Button variant="outlined" color="secondary">
  Nút phụ
</Button> {/* Viền cyan */}

<IconButton>
  <AddIcon />
</IconButton> {/* Hover màu primary */}

<Fab color="primary">
  <AddIcon />
</Fab> {/* Nền gradient */}
```

### 4.4. Form Components

**Mục đích:** Tạo form nhập liệu

```javascript
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
} from '@mui/material';

<FormControl>
  <TextField label="Tên" variant="outlined" /> {/* Viền trắng mờ */}
  <Select value="1">
    <MenuItem value="1">Mục 1</MenuItem>
  </Select>
  <Checkbox /> {/* Màu primary khi chọn */}
  <RadioGroup>
    <FormControlLabel value="1" control={<Radio />} label="Lựa chọn 1" />
  </RadioGroup>
  <Switch /> {/* Track gradient khi bật */}
</FormControl>;
```

### 4.5. Dialog và Snackbar

**Mục đích:** Hiển thị modal hoặc thông báo

```javascript
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert
} from '@mui/material';

<Dialog open={true}>
  <DialogTitle>Tiêu đề</DialogTitle>
  <DialogContent>Nội dung</DialogContent>
</Dialog>

<Snackbar open={true}>
  <Alert severity="success">Thành công!</Alert>
</Snackbar>
```

### 4.6. Table

**Mục đích:** Hiển thị dữ liệu dạng bảng

```javascript
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Tiêu đề</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Dữ liệu</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>;
```

### 4.7. Charts

**Mục đích:** Hiển thị dữ liệu bằng biểu đồ

```javascript
import { BarChart } from '@mui/x-charts';

<BarChart
  series={[{ data: [1, 2, 3] }]}
  height={300}
  xAxis={[{ data: ['A', 'B', 'C'], scaleType: 'band' }]}
/>;
```

### 4.8. Icons

**Mục đích:** Thêm biểu tượng vào giao diện

```javascript
import { IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

<IconButton>
  <EditIcon />
</IconButton> {/* Hover màu primary */}
```

## 5. Lưu ý quan trọng

- ✅ Đảm bảo mọi component nằm trong `ThemeProvider`
- ✅ Kiểm tra `isDarkMode` để điều chỉnh giao diện theo chế độ tối/sáng
- ✅ Sử dụng `sx` prop để ghi đè style cụ thể:

```javascript
<Button sx={{ bgcolor: 'red' }}>Nút đỏ</Button>
```

- ⚠️ Debug lỗi theme bằng cách kiểm tra console và đảm bảo `ThemeContext.js` được import đúng

## 6. Ví dụ tham khảo

Xem file `Template.js` và `MainHeader.js` để thấy cách theme được áp dụng cho các component như Button, Typography, Paper, v.v.

---

> **Ghi chú:** Theme này được tối ưu cho trải nghiệm người dùng với gradient màu đẹp mắt và hỗ trợ dark/light mode hoàn chỉnh.
