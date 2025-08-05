# 🧮 Dynamic Calculator Web App

A beautiful, responsive, and feature-rich calculator web application built with Python Flask backend and modern HTML/CSS/JavaScript frontend.

## ✨ Features

### 🎯 Core Calculator Functions
- **Basic Operations**: Addition, subtraction, multiplication, division
- **Advanced Operations**: Power (^), square root (√), percentage (%)
- **Scientific Functions**: sin, cos, tan, log, ln
- **Memory Functions**: Store (MS), Recall (MR), Clear (MC), Add (M+), Subtract (M-)
- **Expression Evaluation**: Supports complex mathematical expressions with parentheses

### 🎨 Beautiful UI/UX
- **Modern Design**: Glass-morphism design with gradient backgrounds
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Button press effects, ripple animations, and transitions
- **Dark Mode Support**: Automatically adapts to system theme preferences
- **Interactive Elements**: Hover effects, loading states, and visual feedback

### 🚀 Advanced Features
- **History Panel**: Track and reuse previous calculations
- **Keyboard Support**: Full keyboard navigation and input
- **Error Handling**: User-friendly error messages with modal dialogs
- **Scientific Mode**: Toggle between basic and scientific calculator modes
- **Memory Indicator**: Visual indicator when memory contains values
- **Auto-formatting**: Large numbers displayed in scientific notation

## 🛠️ Technology Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Modern CSS with CSS Grid, Flexbox, and CSS Variables
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   pip install Flask==2.3.3 Werkzeug==2.3.7
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## 📁 Project Structure

```
calculator-app/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Stylesheet with modern design
│   └── js/
│       └── calculator.js # JavaScript functionality
└── README.md             # Project documentation
```

## 🎮 Usage

### Basic Operations
- Click number buttons or use keyboard to input numbers
- Use operator buttons (+, -, ×, ÷) or keyboard equivalents
- Press = or Enter to calculate results
- Use C to clear all, CE to clear entry, or Backspace to delete last digit

### Scientific Mode
- Click "Scientific" toggle in the header
- Access trigonometric functions: sin, cos, tan
- Use logarithmic functions: log (base 10), ln (natural log)
- Calculate square roots and powers

### Memory Functions
- **MS (Memory Store)**: Store current display value in memory
- **MR (Memory Recall)**: Recall value from memory to display
- **MC (Memory Clear)**: Clear memory
- **M+ (Memory Add)**: Add current display value to memory
- **M- (Memory Subtract)**: Subtract current display value from memory

### History Panel
- Click the history button (📊) to view calculation history
- Click any history item to use its result
- Clear history with the "Clear" button in history panel

### Keyboard Shortcuts
- **Numbers**: 0-9, decimal point (.)
- **Operators**: +, -, *, /
- **Functions**: (, ), ^, %
- **Actions**: 
  - Enter or = : Calculate
  - Escape: Clear all
  - Backspace: Delete last character

## 🎨 Design Features

### Color Scheme
- Primary: Beautiful gradient from #667eea to #764ba2
- Accent colors for different button types
- Glass-morphism effects with backdrop blur
- Automatic dark mode support

### Animations
- Smooth button hover and press effects
- Ripple click animations
- Slide-in animations for panels
- Loading animations during calculations

### Responsive Design
- Mobile-first approach
- Optimized layouts for different screen sizes
- Touch-friendly button sizes on mobile
- Adaptive font sizes and spacing

## 🔧 API Endpoints

The Flask backend provides the following REST API endpoints:

- `POST /api/calculate` - Evaluate mathematical expressions
- `POST /api/memory` - Memory operations (store, recall, clear, add, subtract)
- `GET /api/history` - Retrieve calculation history
- `DELETE /api/history` - Clear calculation history

## 🌟 Browser Support

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

Feel free to contribute to this project by:
1. Reporting bugs
2. Suggesting new features
3. Submitting pull requests
4. Improving documentation

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for the Inter font family
- Modern CSS techniques and best practices
- Flask framework for the robust backend

---

**Enjoy calculating with style! 🎉**
