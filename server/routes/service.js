const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const multer = require('multer');

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục để lưu file upload
    },
    filename: (req, file, cb) => {
        // Đặt tên file theo định dạng: [thời gian hiện tại]_[tên gốc]
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});
const upload = multer({ storage }); // Sử dụng cấu hình storage

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // Địa chỉ email của bạn
        pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng của email
    },
});

// Thêm dịch vụ mới
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { userId, name, price, description, uemail } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        // Kiểm tra userId
        if (!userId || userId === 'null') {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Kiểm tra file upload
        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const service = new Service({
            name,
            price,
            image: imageUrl,
            description,
            createdBy: userId, // Sử dụng userId từ body request
        });

        await service.save();

        // Gửi email xác nhận
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: uemail, // Người nhận email
            subject: 'Dịch vụ mới đã được tạo',
            text: `Dịch vụ ${name} đã được tạo thành công với giá ${price}.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Lỗi khi gửi email:', error);
            } else {
                console.log('Email gửi thành công:', info.response);
            }
        });

        res.status(201).json({ message: 'Service created successfully', service });
    } catch (error) {
        console.error('Lỗi trong máy chủ:', error);
        res.status(500).json({ error: 'Failed to create service' });
    }
});
// Route lấy tất cả dịch vụ
router.get('/', async (req, res) => {
    try {
        const services = await Service.find(); // Lấy tất cả dịch vụ
        res.status(200).json(services); // Trả về danh sách dịch vụ
    } catch (error) {
        console.error('Lỗi khi lấy dịch vụ:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});
// Route to get a service by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id); // Find service by ID
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(200).json(service); // Return the found service
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ error: 'Failed to fetch service' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const { email } = req.body; // Nhận email từ body request
        
        // Kiểm tra email hợp lệ
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const service = await Service.findByIdAndDelete(id); 
        if (!service) {
            return res.status(404).json({ error: 'Service not found' }); 
        }
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, 
            subject: 'Dịch vụ đã bị xóa',
            text: `Dịch vụ ${service.name} đã bị xóa thành công.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Lỗi khi gửi email:', error);
            } else {
                console.log('Email gửi thành công:', info.response);
            }
        });

        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error); 
        res.status(500).json({ error: 'Failed to delete service' });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;

        let updatedService = {
            name,
            price,
            description,
        };
        if (req.file) {
            const imageUrl = `/uploads/${req.file.filename}`;
            updatedService.image = imageUrl;
        }
        const service = await Service.findByIdAndUpdate(id, updatedService, { new: true });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(200).json({ message: 'Service updated successfully', service });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Failed to update service' });
    }
});

module.exports = router;