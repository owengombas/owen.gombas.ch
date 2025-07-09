use crate::function::Function;

pub struct Quadratic {
    pub a: Vec<Vec<f64>>,
    pub b: Vec<f64>,
    pub c: f64,
}

impl Function for Quadratic {
    fn apply(&self, x: &[f64]) -> f64 {
        let mut result = 0.0;
        let n = x.len();

        for i in 0..n {
            for j in 0..n {
                result += x[i] * self.a[i][j] * x[j];
            }
        }

        result += self.b.iter().zip(x).map(|(bi, xi)| bi * xi).sum::<f64>();
        result + self.c
    }

    fn gradient(&self, x: &[f64]) -> Vec<f64> {
        let n = x.len();
        let mut grad = vec![0.0; n];
        for i in 0..n {
            for j in 0..n {
                grad[i] += 2.0 * self.a[i][j] * x[j];
            }
            grad[i] += self.b[i];
        }
        grad
    }
}
