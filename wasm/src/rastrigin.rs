use crate::function::Function;

pub struct Rastrigin;

impl Function for Rastrigin {
    fn apply(&self, x: &[f64]) -> f64 {
        let x0 = x[0];
        let y0 = x[1];
        20.0 + x0.powi(2) - 10.0 * (2.0 * std::f64::consts::PI * x0).cos()
             + y0.powi(2) - 10.0 * (2.0 * std::f64::consts::PI * y0).cos()
    }

    fn gradient(&self, x: &[f64]) -> Vec<f64> {
        let pi2 = 2.0 * std::f64::consts::PI;
        let x0 = x[0];
        let y0 = x[1];
        let dx = 2.0 * x0 + 10.0 * pi2 * (pi2 * x0).sin();
        let dy = 2.0 * y0 + 10.0 * pi2 * (pi2 * y0).sin();
        vec![dx, dy]
    }
}
