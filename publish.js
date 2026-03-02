import { execSync } from 'child_process';
//перейти на данную публикацию
// Получаем аргументы
const args = process.argv.slice(2);
const command = args[0]; // beta, patch, minor, major
let commitMessage = null;

// Проверяем наличие флага -m и извлекаем сообщение коммита
const messageIndex = args.indexOf('-m');
if (messageIndex !== -1 && args[messageIndex + 1]) {
  commitMessage = args[messageIndex + 1];
}

// Если команда не указана
if (!command) {
  console.error('❌ Please specify: beta | patch | minor | major');
  process.exit(1);
}

// Валидация команды
const validCommands = ['beta', 'patch', 'minor', 'major'];
if (!validCommands.includes(command)) {
  console.error(`❌ Invalid command. Use: ${validCommands.join(' | ')}`);
  process.exit(1);
}

try {
  // 1. Сборка проекта
  // console.log('🛠 Building project...');
  // execSync('npm run build', { stdio: 'inherit' });

  // 2. Git операции (если есть изменения)
  console.log('📦 Staging changes...');
  execSync('git add .', { stdio: 'inherit' });

  // Проверяем, есть ли изменения для коммита
  const status = execSync('git status --porcelain').toString();
  if (status) {
    // Есть незакоммиченные изменения
    if (commitMessage) {
      // Коммитим с пользовательским сообщением
      console.log(`📝 Committing with message: "${commitMessage}"`);
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    } else {
      // Коммитим с автоматическим сообщением
      const autoMessage = `Update for ${command} release`;
      console.log(`📝 Committing with auto message: "${autoMessage}"`);
      execSync(`git commit -m "${autoMessage}"`, { stdio: 'inherit' });
    }
  } else {
    console.log('✨ No changes to commit');
  }

  // 3. Обновление версии (ЛОГИКА ДЛЯ БЕТЫ)
  if (command === 'beta') {
    // Получаем текущую версию
    const packageJson = JSON.parse(execSync('cat package.json').toString());
    const currentVersion = packageJson.version;
    
    // Проверяем, содержит ли текущая версия '-beta'
    if (currentVersion.includes('-beta')) {
      // Уже в бете - увеличиваем номер беты
      console.log('🔄 Already in beta, increasing prerelease...');
      execSync('npm version prerelease', { stdio: 'inherit' });
    } else {
      // Первая бета - начинаем новую бету
      console.log('🆕 Starting new beta...');
      execSync('npm version prepatch --preid=beta', { stdio: 'inherit' });
    }
  } else {
    // Стабильные релизы: patch/minor/major
    console.log(`🔖 Creating ${command} release...`);
    execSync(`npm version ${command}`, { stdio: 'inherit' });
  }

  // 4. Отправка в Git
  console.log('📡 Pushing to Git...');
  execSync('git push --follow-tags', { stdio: 'inherit' });

  // // 5. Публикация в npm (с правильным тегом для беты)
  // console.log('🚀 Publishing to npm...');
  // if (command === 'beta') {
  //   execSync('npm publish --tag beta', { stdio: 'inherit' });
  //   console.log('✅ Published as beta! Install with: npm install <package>@beta');
  // } else {
  //   execSync('npm publish', { stdio: 'inherit' });
  //   console.log('✅ Published as latest! Install with: npm install <package>');
  // }

  // Финальный успех
  const finalVersion = JSON.parse(execSync('cat package.json').toString()).version;
  console.log(`\n✨ Successfully published version ${finalVersion}!`);

} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.log('Check full error log for details');
  process.exit(1);
}

/*
  Примеры использования. -m "Коммит по желанию"
  npm run send beta 
  npm run send patch 
  npm run send minor 
  npm run send major -m "Коммит"
*/