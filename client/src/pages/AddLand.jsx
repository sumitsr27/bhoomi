import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AddLand() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: { address: '', city: '', state: '', pincode: '' },
    area: { value: '', unit: 'sqft' },
    pricePerMonth: '',
    category: 'agricultural',
    features: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name.startsWith('location.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({ ...prev, location: { ...prev.location, [key]: value } }));
    } else if (name.startsWith('area.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({ ...prev, area: { ...prev.area, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      area: { value: Number(form.area.value), unit: form.area.unit },
      pricePerMonth: Number(form.pricePerMonth),
      category: form.category,
      features: form.features ? form.features.split(',').map((s) => s.trim()).filter(Boolean) : [],
    };
    try {
      const { data } = await api.post('/lands', payload);
      const landId = data.land._id;
      if (images.length > 0) {
        const fd = new FormData();
        images.forEach((file) => fd.append('images', file));
        await api.post(`/lands/${landId}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/my-lands');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add land');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 20px', maxWidth: 640 }}>
      <h1 className="page-title">Add Land</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
        {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}
        <div className="form-group">
          <label>Title</label>
          <input name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input name="location.address" value={form.location.address} onChange={handleChange} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>City</label>
            <input name="location.city" value={form.location.city} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>State</label>
            <input name="location.state" value={form.location.state} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
          <label>Pincode</label>
          <input name="location.pincode" value={form.location.pincode} onChange={handleChange} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Area value</label>
            <input type="number" name="area.value" value={form.area.value} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Unit</label>
            <select name="area.unit" value={form.area.unit} onChange={handleChange}>
            <option value="sqft">sqft</option>
            <option value="sqm">sqm</option>
            <option value="acre">acre</option>
            <option value="hectare">hectare</option>
          </select>
          </div>
        </div>
        <div className="form-group">
          <label>Rent per month (₹)</label>
          <input type="number" name="pricePerMonth" value={form.pricePerMonth} onChange={(e) => setForm({ ...form, pricePerMonth: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="agricultural">Agricultural</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Features (comma-separated)</label>
          <input name="features" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="e.g. Water supply, Fencing" />
        </div>
        <div className="form-group">
          <label>Images (optional, max 5)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files || []).slice(0, 5))} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Adding...' : 'Add Land'}
        </button>
      </form>
    </div>
  );
}
