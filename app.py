from flask import Flask, render_template, request, jsonify
import math
import re

app = Flask(__name__)

class Calculator:
    def __init__(self):
        self.memory = 0
        self.history = []
    
    def add(self, a, b):
        return a + b
    
    def subtract(self, a, b):
        return a - b
    
    def multiply(self, a, b):
        return a * b
    
    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b
    
    def power(self, a, b):
        return a ** b
    
    def square_root(self, a):
        if a < 0:
            raise ValueError("Cannot calculate square root of negative number")
        return math.sqrt(a)
    
    def percentage(self, a, b):
        return (a * b) / 100
    
    def sin(self, a):
        return math.sin(math.radians(a))
    
    def cos(self, a):
        return math.cos(math.radians(a))
    
    def tan(self, a):
        return math.tan(math.radians(a))
    
    def log(self, a):
        if a <= 0:
            raise ValueError("Cannot calculate logarithm of non-positive number")
        return math.log10(a)
    
    def ln(self, a):
        if a <= 0:
            raise ValueError("Cannot calculate natural logarithm of non-positive number")
        return math.log(a)
    
    def factorial(self, n):
        if n < 0 or not isinstance(n, int):
            raise ValueError("Factorial is only defined for non-negative integers")
        return math.factorial(n)
    
    def evaluate_expression(self, expression):
        # Clean the expression
        expression = expression.replace(' ', '')
        
        # Replace special functions
        expression = re.sub(r'sin\(([^)]+)\)', lambda m: str(self.sin(float(m.group(1)))), expression)
        expression = re.sub(r'cos\(([^)]+)\)', lambda m: str(self.cos(float(m.group(1)))), expression)
        expression = re.sub(r'tan\(([^)]+)\)', lambda m: str(self.tan(float(m.group(1)))), expression)
        expression = re.sub(r'log\(([^)]+)\)', lambda m: str(self.log(float(m.group(1)))), expression)
        expression = re.sub(r'ln\(([^)]+)\)', lambda m: str(self.ln(float(m.group(1)))), expression)
        expression = re.sub(r'sqrt\(([^)]+)\)', lambda m: str(self.square_root(float(m.group(1)))), expression)
        
        # Replace ^ with **
        expression = expression.replace('^', '**')
        
        try:
            # Evaluate the expression safely
            result = eval(expression)
            self.history.append(f"{expression} = {result}")
            return result
        except Exception as e:
            raise ValueError(f"Invalid expression: {str(e)}")
    
    def memory_store(self, value):
        self.memory = value
    
    def memory_recall(self):
        return self.memory
    
    def memory_clear(self):
        self.memory = 0
    
    def memory_add(self, value):
        self.memory += value
    
    def memory_subtract(self, value):
        self.memory -= value
    
    def get_history(self):
        return self.history[-10:]  # Return last 10 calculations
    
    def clear_history(self):
        self.history = []

calculator = Calculator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/calculate', methods=['POST'])
def calculate():
    try:
        data = request.get_json()
        expression = data.get('expression', '')
        
        if not expression:
            return jsonify({'error': 'No expression provided'}), 400
        
        result = calculator.evaluate_expression(expression)
        return jsonify({'result': result, 'expression': expression})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/memory', methods=['POST'])
def memory_operation():
    try:
        data = request.get_json()
        operation = data.get('operation')
        value = data.get('value', 0)
        
        if operation == 'store':
            calculator.memory_store(value)
            return jsonify({'memory': calculator.memory})
        elif operation == 'recall':
            return jsonify({'memory': calculator.memory_recall()})
        elif operation == 'clear':
            calculator.memory_clear()
            return jsonify({'memory': calculator.memory})
        elif operation == 'add':
            calculator.memory_add(value)
            return jsonify({'memory': calculator.memory})
        elif operation == 'subtract':
            calculator.memory_subtract(value)
            return jsonify({'memory': calculator.memory})
        else:
            return jsonify({'error': 'Invalid memory operation'}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify({'history': calculator.get_history()})

@app.route('/api/history', methods=['DELETE'])
def clear_history():
    calculator.clear_history()
    return jsonify({'message': 'History cleared'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)