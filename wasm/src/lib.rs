mod function;
mod optimizer;
mod quadratic;
mod rastrigin;

use function::Function;
use optimizer::gradient_descent;
use quadratic::Quadratic;
use rastrigin::Rastrigin;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum FunctionType {
    Quadratic,
    Rastrigin,
}

#[wasm_bindgen]
pub struct SurfaceData {
    x: Vec<f64>,
    y: Vec<f64>,
    z: Vec<f64>,
    #[wasm_bindgen(skip)]
    f: Box<dyn Function>,
}

#[wasm_bindgen]
impl SurfaceData {
    #[wasm_bindgen(constructor)]
    pub fn new(
        x_min: f64,
        x_max: f64,
        x_steps: usize,
        y_min: f64,
        y_max: f64,
        y_steps: usize,
        function_type: FunctionType,
    ) -> SurfaceData {
        let x: Vec<f64> = (0..x_steps)
            .map(|i| x_min + i as f64 * (x_max - x_min) / ((x_steps - 1) as f64))
            .collect();

        let y: Vec<f64> = (0..y_steps)
            .map(|i| y_min + i as f64 * (y_max - y_min) / ((y_steps - 1) as f64))
            .collect();

        let f: Box<dyn Function> = match function_type {
            FunctionType::Quadratic => {
                let a = vec![vec![1.0, 0.0], vec![0.0, 1.0]]; // Identity matrix
                let b = vec![0.0, 0.0]; // Centered
                let c = 0.0;
                Box::new(Quadratic { a, b, c })
            }
            FunctionType::Rastrigin => Box::new(Rastrigin),
        };

        let mut z = Vec::with_capacity(x_steps * y_steps);
        for yi in &y {
            for xi in &x {
                z.push(f.apply(&[*xi, *yi]));
            }
        }

        SurfaceData { x, y, z, f }
    }

    pub fn x(&self) -> Vec<f64> {
        self.x.clone()
    }

    pub fn y(&self) -> Vec<f64> {
        self.y.clone()
    }

    pub fn z(&self) -> Vec<f64> {
        self.z.clone()
    }

    pub fn minimize(&self, x0_x: f64, x0_y: f64) -> Vec<f64> {
        gradient_descent(&*self.f, vec![x0_x, x0_y], 0.01, 0.8, 1e-6, 2000)
    }
}
