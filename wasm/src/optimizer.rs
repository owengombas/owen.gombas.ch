use crate::function::Function;
use std::f64;

pub fn gradient_descent(
    f: &dyn Function,
    mut x: Vec<f64>,
    alpha: f64,
    beta: f64,
    tol: f64,
    max_iter: usize,
) -> Vec<f64> {
    let mut path = Vec::with_capacity(3 * max_iter);
    let mut fx = f.apply(&x);

    path.push(x[0]);
    path.push(x[1]);
    path.push(fx);

    for _ in 0..max_iter {
        let grad = f.gradient(&x);
        let norm = grad.iter().map(|v| v * v).sum::<f64>().sqrt();
        if norm < tol {
            break;
        }

        let mut t = 1.0;
        let grad_dot = grad.iter().map(|g| g * g).sum::<f64>();

        while t > 1e-10 {
            let x_new: Vec<f64> = x.iter().zip(&grad).map(|(xi, gi)| xi - t * gi).collect();
            let fx_new = f.apply(&x_new);
            if fx_new <= fx - alpha * t * grad_dot {
                x = x_new;
                fx = fx_new;
                break;
            }
            t *= beta;
        }

        path.push(x[0]);
        path.push(x[1]);
        path.push(fx);
    }

    path
}
