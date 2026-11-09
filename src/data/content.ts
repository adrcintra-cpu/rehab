export const config = {
  name: 'REHAB Clinic Club',
  title: 'Rehab Clinic Club | Mentoria de Gestão para Clínicas',
  description: 'Mentoria em grupo para donos de clínicas de reabilitação que desejam atrair mais pacientes, melhorar a lucratividade e construir uma operação mais independente.',
  // Configure no ambiente de build. O endpoint deve validar os dados no servidor.
  leadEndpoint: import.meta.env.PUBLIC_PRIVACY_APPROVED === 'true' ? (import.meta.env.PUBLIC_LEAD_ENDPOINT || '') : '',
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL || '',
};
export const navigation = [
  { label: 'O método', href: '#metodo' },
  { label: 'O programa', href: '#jornada' },
  { label: 'Mentoras', href: '#mentoras' },
];
export const pillars = [
  { letter: 'R', title: 'REPROGRAMAR', text: 'Você desenvolve uma nova forma de enxergar sua clínica, compreendendo seu papel como empresário e aprendendo a tomar decisões com uma visão mais estratégica.' },
  { letter: 'E', title: 'ESTRUTURAR', text: 'Você aprende a estruturar processos, responsabilidades e indicadores para ter mais controle sobre a operação, as finanças e os resultados.' },
  { letter: 'H', title: 'HUMANIZAR', text: 'Você fortalece sua liderança, desenvolve profissionais e constrói uma cultura que preserva o cuidado com os pacientes.' },
  { letter: 'A', title: 'ACELERAR', text: 'Você desenvolve uma visão comercial do negócio para fortalecer o posicionamento da clínica, atrair novos pacientes e aumentar o faturamento sem comprometer a qualidade do atendimento.' },
  { letter: 'B', title: 'BLINDAR', text: 'Você começa a criar condições para sustentar o crescimento, reduzir a dependência da sua presença e desenvolver uma empresa capaz de continuar evoluindo.' },
];
export const program = [
 { title: '12 meses de mentoria em grupo', text: 'Uma jornada de desenvolvimento para fortalecer sua clínica e construir um negócio mais sólido e independente.' },
 { title: 'Encontros online semanais', text: 'Encontros ao vivo para aprofundar conhecimentos, compartilhar desafios e aplicar estratégias que impulsionem o crescimento.' },
 { title: 'Acesso direto às mentoras', text: 'Um canal pelo WhatsApp com Vanessa e Bárbara para esclarecer dúvidas e receber orientações ao longo da jornada.' },
 { title: 'Grupo fechado de networking', text: 'Conecte-se com outros donos de clínicas de reabilitação e construa relacionamentos com profissionais que enfrentam desafios semelhantes.' },
 { title: 'Dois encontros presenciais por ano', text: 'Imersões para trocar experiências e fortalecer conexões com as mentoras e os membros do Rehab Clinic Club.' },
];
export const mentors = [
 { name: 'Bárbara Soares', role: 'Gestão, liderança e desenvolvimento empresarial.', description: 'Empresária com 14 anos à frente de uma clínica, Bárbara é referência em gestão, liderança de equipes e desenvolvimento empresarial. Conhece de perto os desafios de quem começou pela prática profissional e precisou desenvolver competências para administrar a própria empresa. Uma clínica precisa de gestão, processos e pessoas preparadas para crescer.', themes: ['14 anos à frente de uma clínica', 'Gestão', 'Liderança de equipes', 'Processos', 'Desenvolvimento empresarial'] },
 { name: 'Vanessa Madaschi', role: 'Expansão e liberdade empresarial.', description: 'Com 30 anos de experiência em reabilitação infantil, Vanessa é especialista em expansão e liberdade empresarial. Suas pesquisas e trajetória a tornaram referência nacional e internacional. Sua experiência reforça uma das bases do Rehab Clinic Club: preservar a excelência clínica, o cuidado e o impacto na vida dos pacientes e suas famílias durante o crescimento da operação.', themes: ['30 anos em reabilitação infantil', 'Expansão', 'Liberdade empresarial', 'Excelência clínica', 'Cuidado com pacientes e famílias'] },
];
export const audience = [
 ['Você possui uma clínica com equipe', 'É fisioterapeuta, terapeuta ocupacional, fonoaudiólogo ou psicólogo e possui uma clínica com equipe.'],
 ['O negócio ainda depende demais de você', 'Sua clínica está estabelecida, mas você sente que sua presença é indispensável para que a operação funcione.'],
 ['Você quer crescer com lucratividade', 'Deseja aumentar o faturamento e melhorar a lucratividade da sua clínica.'],
 ['Você quer ampliar a transformação que entrega', 'Quer construir uma empresa à altura da transformação que entrega aos pacientes.'],
];
export const painPoints = [
 'Sua clínica fatura, mas o lucro não acompanha o crescimento.',
 'Você depende de indicações e não consegue atrair pacientes com previsibilidade.',
 'Sua rotina é consumida por atendimentos e problemas operacionais.',
 'Sua clínica cresceu, mas ainda faltam processos e organização para expandir.',
 'Sua equipe depende de você para praticamente todas as decisões.',
 'Você tem dificuldade para delegar e confiar nos colaboradores.',
];
export const pageCopy = {
 hero: {
  headline: 'Transforme sua clínica de reabilitação',
  emphasis: 'em uma referência na sua cidade.',
  complement: 'Conquiste o reconhecimento que seu trabalho merece.',
  description: 'Grupo de mentoria exclusivo para donos de clínicas que desejam atrair mais pacientes, escalar o faturamento e construir uma operação mais independente.',
  cta: 'Quero fazer minha aplicação',
 },
 application: {
  description: 'Você está a um passo de se tornar membro do Rehab Clinic Club. Cada candidatura é analisada individualmente e nosso time entra em contato pelo WhatsApp informado.',
  invitation: 'Se sua clínica chegou a um momento em que o conhecimento técnico já não é suficiente para sustentar o próximo estágio de crescimento, faça sua aplicação.',
  cta: 'Fazer minha aplicação',
 },
};
export const challenges = ['Gestão e processos', 'Liderança e equipe', 'Crescimento e vendas', 'Posicionamento', 'Reduzir dependência do proprietário', 'Outro'];
