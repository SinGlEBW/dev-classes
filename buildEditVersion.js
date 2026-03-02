import { execSync } from "child_process";
import fs from "fs";

console.log("📋 Полученные :", process.argv);
const args = process.argv.slice(2);
console.log("📋 Полученные аргументы:", args);

const name_version = args[0]; // beta, patch, minor, major
let comandPublish = args[1]; // gitpush или undefined

let commitMessage = null;

// Проверяем наличие флага -m и извлекаем сообщение коммита

let list = [];
if (comandPublish) {
  list = comandPublish.split(":");
  if (list.length == 2) {
    comandPublish = list[0];
    commitMessage = list[1];
  }
}
console.log(`📦 Команда версии: ${name_version}`);
console.log(`🚀 Git команда: ${comandPublish}`);
console.log(`📝 Сообщение: ${commitMessage}`);

// Если команда не указана
if (!name_version) {
  console.error("❌ Please specify: beta | patch | minor | major");
  process.exit(1);
}

// Валидация команды
const validCommands = ["beta", "patch", "minor", "major"];
if (!validCommands.includes(name_version)) {
  console.error(`❌ Invalid name_version. Use: ${validCommands.join(" | ")}`);
  process.exit(1);
}

try {
  // Сохраняем текущую версию
  const packageJson = JSON.parse(fs.readFileSync("package.json"));
  const currentVersion = packageJson.version;
  console.log(`📦 Текущая версия: ${currentVersion}`);

  // 1. СНАЧАЛА обновляем версию (БЕЗ git тегов)
  console.log(`🔖 Обновление версии до ${name_version}...`);
  if (name_version === "beta") {
    if (currentVersion.includes("-beta")) {
      execSync("npm version prerelease --no-git-tag-version", { stdio: "inherit" });
    } else {
      execSync("npm version prepatch --preid=beta --no-git-tag-version", { stdio: "inherit" });
    }
  } else {
    execSync(`npm version ${name_version} --no-git-tag-version`, { stdio: "inherit" });
  }

  // Получаем новую версию
  const newVersion = JSON.parse(fs.readFileSync("package.json")).version;
  console.log(`✨ Новая версия: ${newVersion}`);

  // 2. Обновляем CHANGELOG.md
  // console.log("📝 Обновление CHANGELOG.md...");
  // updateChangelog(currentVersion, newVersion, name_version, commitMessage);
  // 2. ПОТОМ сборка с новой версией
  console.log("🛠 Building project...");
  execSync("npm run build", { stdio: "inherit" });

  console.log("📦 Staging changes...");
  execSync("git add .", { stdio: "inherit" });

  // Проверяем, есть ли изменения для коммита
  const status = execSync("git status --porcelain").toString();
  console.log("📊 Статус изменений:", status ? "есть изменения" : "нет изменений");

  if (status) {
    // Есть незакоммиченные изменения
    if (commitMessage) {
      // Коммитим с пользовательским сообщением
      console.log(`📝 Committing with message: "${commitMessage}"`);
      execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });
    } else {
      // Коммитим с автоматическим сообщением
      const autoMessage = `Release ${newVersion}`;
      console.log(`📝 Committing with auto message: "${autoMessage}"`);
      execSync(`git commit -m "${autoMessage}"`, { stdio: "inherit" });
    }
  } else {
    console.log("✨ No changes to commit");
  }

  // 4. Создаем git тег
  console.log(`🏷 Creating git tag v${newVersion}...`);
  execSync(`git tag -a v${newVersion} -m "Release ${newVersion}"`, { stdio: "inherit" });

  // 5. Если указан gitpush
  if (comandPublish === "gitpush") {
    console.log("📡 Pushing to Git...");
    execSync("git push --follow-tags", { stdio: "inherit" });

    console.log("✅ Git push completed!");
  } else {
    console.log("⏭ Git push пропущен (нет команды gitpush)");
  }

  console.log('🚀 Publishing to npm...');
  execSync('npm publish', { stdio: 'inherit' });

  console.log(`\n✨ Successfully completed! Version: ${newVersion}`);
} catch (error) {
  console.error("\n❌ Error:", error.message);
  if (error.stderr) {
    console.error("📌 Stderr:", error.stderr.toString());
  }
  process.exit(1);
}

function updateChangelog(oldVersion, newVersion, versionType, userMessage) {
  const changelogPath = "CHANGELOG.md";
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Определяем заголовок секции в зависимости от типа версии
  let sectionHeader;
  if (versionType === "beta") {
    sectionHeader = `## [${newVersion}] - ${date} (Beta)`;
  } else if (versionType === "patch") {
    sectionHeader = `## [${newVersion}] - ${date} (Patch)`;
  } else if (versionType === "minor") {
    sectionHeader = `## [${newVersion}] - ${date} (Minor)`;
  } else if (versionType === "major") {
    sectionHeader = `## [${newVersion}] - ${date} (Major)`;
  }

  // Формируем содержимое новой секции
  let newSection = `${sectionHeader}\n\n`;
  
  if (userMessage) {
    // Если есть пользовательское сообщение, используем его
    newSection += `### Changes\n- ${userMessage}\n\n`;
  } else {
    // Иначе пытаемся получить коммиты с прошлого релиза
    try {
      // Получаем коммиты между тегами
      const commits = execSync(`git log --pretty=format:"- %s" v${oldVersion}..HEAD`, { encoding: 'utf8' });
      if (commits.trim()) {
        newSection += `### What's Changed\n${commits}\n\n`;
      } else {
        newSection += `### What's Changed\n- Version bump to ${newVersion}\n\n`;
      }
    } catch (e) {
      // Если тега нет, получаем последние коммиты
      try {
        const commits = execSync(`git log --pretty=format:"- %s" -n 10`, { encoding: 'utf8' });
        newSection += `### What's Changed\n${commits}\n\n`;
      } catch (e2) {
        newSection += `### What's Changed\n- Version bump to ${newVersion}\n\n`;
      }
    }
  }

  // Добавляем ссылки для сравнения версий
  const compareLink = `[${newVersion}]: https://github.com/your-repo/compare/v${oldVersion}...v${newVersion}\n`;
  
  // Проверяем, существует ли файл
  if (!fs.existsSync(changelogPath)) {
    // Создаем новый CHANGELOG
    const header = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n`;
    const format = `The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).\n\n`;
    const content = header + format + newSection + `\n${compareLink}`;
    fs.writeFileSync(changelogPath, content);
    console.log("✅ CHANGELOG.md создан");
  } else {
    // Обновляем существующий CHANGELOG
    let changelog = fs.readFileSync(changelogPath, "utf8");
    
    // Вставляем новую секцию после заголовка
    const lines = changelog.split('\n');
    let insertIndex = 0;
    
    // Ищем конец заголовка (первая пустая строка после заголовков)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('#') || lines[i].trim() === '') {
        insertIndex = i + 1;
      } else {
        break;
      }
    }
    
    // Вставляем новую секцию
    lines.splice(insertIndex, 0, newSection);
    changelog = lines.join('\n');
    
    // Добавляем ссылку для сравнения в конец файла
    if (!changelog.includes(`[${newVersion}]:`)) {
      changelog += `\n${compareLink}`;
    }
    
    fs.writeFileSync(changelogPath, changelog);
    console.log("✅ CHANGELOG.md обновлен");
  }
}
/*
  Варианты использования 
    npm run build:dev beta
    npm run build:dev beta gitpush
    npm run build:dev beta gitpush:"Hotfix critical bug"
    npm run build:dev patch gitpush:"Version bump"
    npm run build:dev minor gitpush:"New features"
    npm run build:dev major gitpush:"Breaking changes"
    ...
*/
