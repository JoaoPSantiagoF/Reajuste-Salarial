const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

  if (!idade && !sexo && !salario_base && !anoContratacao && !matricula) {
    return res.send(`
      <html>
        <head>
          <title>Reajuste Salarial - Presidente Prudente</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #eef2f3; color: #333; text-align: center; padding: 40px; }
            h1 { color: #2c3e50; }
            code { background: #f8f8f8; padding: 10px; display: inline-block; border-radius: 5px; margin-top: 15px; }
            .info { max-width: 700px; margin: 0 auto; text-align: justify; }
          </style>
        </head>
        <body>
          <h1>Calculadora de Reajuste Salarial</h1>
          <div class="info">
            <p>Bem-vindo(a) ao sistema de cálculo de reajuste da empresa de Presidente Prudente-SP.</p>
            <p>Para calcular o novo salário de um funcionário, informe os dados na URL conforme o exemplo abaixo:</p>
            <code>http://localhost:3000/?idade=30&sexo=F&salario_base=1700&anoContratacao=2014&matricula=12345</code>
            <p><strong>Regras de validação:</strong></p>
            <ul style="text-align:left; display:inline-block;">
              <li>A idade deve ser maior que <strong>16 anos</strong>.</li>
              <li>O salário base deve ser um número real válido.</li>
              <li>O ano de contratação deve ser maior que <strong>1960</strong>.</li>
              <li>A matrícula deve ser um número inteiro maior que zero.</li>
            </ul>
          </div>
        </body>
      </html>
    `);
  }

  if (
    !idade || isNaN(idade) || idade <= 16 ||
    !salario_base || isNaN(salario_base) || salario_base <= 0 ||
    !anoContratacao || isNaN(anoContratacao) || anoContratacao <= 1960 ||
    !matricula || isNaN(matricula) || matricula <= 0 ||
    !sexo || !['M', 'F'].includes(sexo.toUpperCase())
  ) {
    return res.send(`
      <html>
        <head>
          <title>Erro nos Dados</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #ffeaea; color: #b00000; padding: 30px; text-align: center; }
            h1 { color: #b00000; }
            code { background: #fff0f0; padding: 8px; border-radius: 5px; display: inline-block; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h1>Erro nos dados informados!</h1>
          <p>Verifique se todos os parâmetros estão corretos e válidos.</p>
          <p>Exemplo correto:</p>
          <code>http://localhost:3000/?idade=25&sexo=M&salario_base=2500&anoContratacao=2015&matricula=9876</code>
        </body>
      </html>
    `);
  }

  const idadeNum = parseInt(idade);
  const salarioNum = parseFloat(salario_base);
  const anoNum = parseInt(anoContratacao);
  const sexoFormatado = sexo.toUpperCase();

  let percentual = 0;
  if (anoNum < 2010) {
    percentual = 0.10;
  } else if (anoNum <= 2020) {
    percentual = 0.07;
  } else {
    percentual = 0.05;
  }
  if (sexoFormatado === 'F' && salarioNum <= 2000) {
    percentual += 0.02;
  }

  const reajuste = salarioNum * percentual;
  const novoSalario = salarioNum + reajuste;

  res.send(`
    <html>
      <head>
        <title>Resultado do Reajuste</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f6f8fa; color: #333; padding: 40px; }
          .container { background-color: #fff; border-radius: 10px; padding: 30px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          h1 { text-align: center; color: #2c3e50; }
          p { font-size: 18px; }
          .highlight { color: #0a6c2f; font-weight: bold; font-size: 22px; text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Dados do Funcionário</h1>
          <p><strong>Matrícula:</strong> ${matricula}</p>
          <p><strong>Idade:</strong> ${idadeNum}</p>
          <p><strong>Sexo:</strong> ${sexoFormatado}</p>
          <p><strong>Salário Base:</strong> R$ ${salarioNum.toFixed(2)}</p>
          <p><strong>Ano de Contratação:</strong> ${anoNum}</p>
          <p><strong>Percentual de Reajuste:</strong> ${(percentual * 100).toFixed(1)}%</p>
          <p class="highlight">Novo Salário: R$ ${novoSalario.toFixed(2)}</p>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Servidor rodando em: http://localhost:${port}`);
});
