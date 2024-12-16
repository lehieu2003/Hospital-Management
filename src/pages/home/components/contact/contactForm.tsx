import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface Status {
    loading: boolean;
    error: string;
    success: string;
}

function ContactForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState<Status>({
        loading: false,
        error: '',
        success: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: '' });

        setTimeout(() => {
            setStatus({
                loading: false,
                success: 'Your message has been sent. Thank you',
                error: ''
            });
        }, 2000);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="php-email-form"
            data-aos="fade-up"
            data-aos-delay="200"
        >
            <div className="row mt-2 mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Họ và tên"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="col-md-12 mb-4">
                <input
                    type="text"
                    name="subject"
                    className="form-control"
                    placeholder="Tiêu đề"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                />
            </div>

            <div className="col-md-12 mb-3">
                <textarea
                    className="form-control"
                    name="message"
                    placeholder="Nội dung"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                />
            </div>

            <div className="col-md-12 text-center">
                {status.loading && <div className="loading">Loading</div>}
                {status.error && <div className="error-message">{status.error}</div>}
                {status.success && <div className="sent-message">{status.success}</div>}

                <button type="submit" disabled={status.loading}>Gửi</button>
            </div>
        </form>
    );
}

export default ContactForm;
