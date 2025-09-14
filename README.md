# Breast Cancer Risk Classifier - Research Prototype

An AI breast cancer risk classifier built with Django and React. This tool accepts numeric tumor/cyst measurements and returns classification predictions with feature contributions for research purposes.

## ⚠️ Important Disclaimer

**This tool is for research and educational purposes only and is not a medical device or diagnostic tool.** It may be inaccurate or incomplete. Do not rely on it to make medical decisions. Always consult a qualified healthcare professional.

## 🏗️ Architecture

- **Backend**: Django 5 + Django REST Framework + SQLite
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **ML**: scikit-learn integration with graceful fallbacks
- **Charts**: recharts for feature contribution visualization

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env as needed
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the Django server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173
DUMMY_MODE=True
EXPLAIN_WITH_SHAP=False
```

### Model Integration

To use your own trained model:

1. Place your model files in `backend/inference/model/`:
   - `model_pipeline.pkl` - Your trained scikit-learn Pipeline
   - `version.txt` - Model version string

2. Update `backend/inference/schema.json` with your feature schema

3. Set `DUMMY_MODE=False` in your `.env` file

## 📊 API Endpoints

### Health Check
- `GET /api/health/` - Returns `{"status": "ok"}`

### Schema
- `GET /api/schema/` - Returns feature schema for dynamic form generation

### Prediction
- `POST /api/predict/` - Submit measurements and get prediction
  - Request: `{"radius_mean": 14.1, "texture_mean": 19.3, ...}`
  - Response: `{"submission_id": 123, "prediction_label": "benign", "probability_malignant": 0.23, "top_contributions": [...], "model_version": "v1.0"}`

### Confirmation
- `POST /api/confirm/` - Confirm doctor outcome
  - Request: `{"submission_id": 123, "confirmed_label": 0}`
  - Response: `{"status": "ok", "submission_id": 123, "confirmed_label": 0}`

### Submission Retrieval
- `GET /api/submissions/<id>/` - Get specific submission details

## 🎯 Features

### Dynamic Form Generation
- Form fields are generated dynamically based on the backend schema
- Client-side validation using Zod
- Responsive design with Tailwind CSS

### Prediction Results
- Clear benign/malignant classification
- Probability percentage display
- Feature contribution visualization with horizontal bar charts
- Model version tracking

### Doctor Confirmation
- Submit confirmed outcomes to improve model accuracy
- Track confirmation status and timestamps
- Research-grade data collection

### Graceful Fallbacks
- **Dummy Mode**: Returns deterministic mock predictions when no model is available
- **Error Handling**: Graceful degradation with user-friendly error messages
- **Feature Explanations**: Multiple fallback methods for feature contributions

## 🧪 Testing the System

### Dummy Mode (Default)
The system runs in dummy mode by default, providing consistent mock predictions for testing:

1. Start both servers
2. Visit `http://localhost:5173`
3. Accept the consent dialog
4. Fill out the measurement form
5. Submit to see mock prediction results

### With Real Model
1. Place your model files in `backend/inference/model/`
2. Set `DUMMY_MODE=False` in `.env`
3. Restart the backend server
4. The system will use your trained model for predictions

## 📁 Project Structure

```
breast-ai/
├── backend/
│   ├── core/                   # Django project settings
│   ├── api/                    # Django REST API app
│   │   ├── models.py          # Submission model
│   │   ├── serializers.py     # API serializers
│   │   ├── views.py           # API endpoints
│   │   └── urls.py            # URL routing
│   ├── inference/             # ML inference system
│   │   ├── predictor.py       # Model loading & prediction
│   │   ├── explainer.py       # Feature contribution analysis
│   │   ├── schema.json        # Feature schema
│   │   └── model/             # Model files directory
│   │       └── README.md      # Model integration instructions
│   ├── manage.py
│   ├── requirements.txt
│   └── env.example
└── frontend/
    ├── src/
    │   ├── components/        # React components
    │   │   ├── ui/           # shadcn/ui components
    │   │   ├── Shell.tsx     # App layout
    │   │   ├── ConsentDialog.tsx
    │   │   ├── MeasurementForm.tsx
    │   │   ├── ResultCard.tsx
    │   │   ├── ContributionChart.tsx
    │   │   ├── ConfirmForm.tsx
    │   │   └── Disclaimer.tsx
    │   ├── pages/            # Page components
    │   │   ├── Home.tsx
    │   │   ├── Confirm.tsx
    │   │   └── About.tsx
    │   ├── lib/              # Utilities
    │   │   ├── api.ts        # API client
    │   │   ├── format.ts     # Formatting utilities
    │   │   └── utils.ts      # General utilities
    │   ├── App.tsx           # Main app component
    │   └── main.tsx          # Entry point
    ├── package.json
    └── vite.config.ts
```

## 🔒 Privacy & Ethics

- **Local Processing**: All data processing happens locally
- **No Personal Data**: No personal identifiers are collected
- **Research Purpose**: Data is used for research and model improvement
- **Consent Required**: Users must explicitly consent before using the tool
- **Clear Disclaimers**: Prominent warnings about medical limitations

## 🛠️ Development

### Backend Development
```bash
cd backend
python manage.py makemigrations  # After model changes
python manage.py migrate
python manage.py runserver
```

### Frontend Development
```bash
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

### Database Management
```bash
cd backend
python manage.py shell          # Django shell
python manage.py createsuperuser # Create admin user
python manage.py runserver      # Access admin at /admin/
```

## 📝 TODO for Production

- [ ] Add comprehensive test suite
- [ ] Implement proper logging and monitoring
- [ ] Add data validation and sanitization
- [ ] Implement rate limiting
- [ ] Add API documentation with OpenAPI/Swagger
- [ ] Set up CI/CD pipeline
- [ ] Add database backup procedures
- [ ] Implement proper error tracking

## 🤝 Contributing

This is a research prototype. For contributions or questions, please contact the research team.

## 📄 License

This project is for research purposes only. Please ensure compliance with all applicable regulations and ethical guidelines when using this software.

---

**Remember**: This tool is for research and educational purposes only. Always consult qualified healthcare professionals for medical decisions.

