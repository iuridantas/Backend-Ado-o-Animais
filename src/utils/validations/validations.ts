export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '');

  if (cleanCPF.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  let sum = 0;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.charAt(i - 1)) * (11 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCPF.charAt(9))) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.charAt(i - 1)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCPF.charAt(10))) {
    return false;
  }

  return true;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const domainRegex = /@(outlook|gmail|hotmail|yahoo|icloud|example|test)\./i;
  const isValidDomain = domainRegex.test(email);
  return emailRegex.test(email) && isValidDomain;
}

export function isValidPassword(password: string): string | null {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (password.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres.';
  }

  if (!/[a-z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra minúscula.';
  }

  if (!/[A-Z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra maiúscula.';
  }

  if (!/\d/.test(password)) {
    return 'A senha deve conter pelo menos um número.';
  }

  if (!/[@$!%*?&]/.test(password)) {
    return 'A senha deve conter pelo menos um caractere especial: @$!%*?&';
  }

  if (!passwordRegex.test(password)) {
    return 'Sua senha deve conter 8 digitos ou mais, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.';
  }

  return null;
}
