import os
import subprocess

edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
lr10_dir = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(lr10_dir, 'index.html'), 'r', encoding='utf-8') as f:
    html_content = f.read()

# 1. Start state screenshot
cmd1 = [
    edge, '--headless', '--disable-gpu',
    f'--screenshot={os.path.join(lr10_dir, "screenshot_lr10_start.png")}',
    '--window-size=850,600',
    f'file:///{os.path.join(lr10_dir, "index.html")}'
]
subprocess.run(cmd1, timeout=10)

# 2. Win state HTML: 3 money bags in the center row like in user Figma!
html_win = html_content.replace(
    '<h1 class="player-title" id="user-name">User</h1>',
    '<h1 class="player-title" id="user-name">Владислав</h1>'
).replace(
    '<div class="attempt-badge" id="attempt-info">Спроба 0 з 3</div>',
    '<div class="attempt-badge" id="attempt-info">Спроба 2 з 3</div>'
).replace(
    '<div class="status-box" id="game-status">Натисніть "Generate" або потягніть важіль</div>',
    '<div class="status-box" id="game-status" style="color: #00ff00;">🎉 ПЕРЕМОГА! Владислав вибив однаковий ряд!</div>'
).replace(
    '<div class="payline" id="payline"></div>',
    '<div class="payline active" id="payline"></div>'
).replace(
    '<button id="generate-btn" class="btn-generate">Generate</button>',
    '<button id="generate-btn" class="btn-generate" disabled>Generate</button>'
).replace(
    '<button id="restart-btn" class="btn-restart" style="display: none;">Грати знову</button>',
    '<button id="restart-btn" class="btn-restart" style="display: inline-block;">Грати знову</button>'
).replace(
    '<div class="reel-strip" id="strip-1"></div>',
    '<div class="reel-strip" id="strip-1">'
    '<div class="reel-symbol"><img src="images/peach.svg" alt="Персик"></div>'
    '<div class="reel-symbol"><img src="images/money_bag.svg" alt="Мішок грошей"></div>'
    '<div class="reel-symbol"><img src="images/lemon.svg" alt="Лимон"></div>'
    '</div>'
).replace(
    '<div class="reel-strip" id="strip-2"></div>',
    '<div class="reel-strip" id="strip-2">'
    '<div class="reel-symbol"><img src="images/pear.svg" alt="Груша"></div>'
    '<div class="reel-symbol"><img src="images/money_bag.svg" alt="Мішок грошей"></div>'
    '<div class="reel-symbol"><img src="images/cherries.svg" alt="Вишні"></div>'
    '</div>'
).replace(
    '<div class="reel-strip" id="strip-3"></div>',
    '<div class="reel-strip" id="strip-3">'
    '<div class="reel-symbol"><img src="images/apple.svg" alt="Яблуко"></div>'
    '<div class="reel-symbol"><img src="images/money_bag.svg" alt="Мішок грошей"></div>'
    '<div class="reel-symbol"><img src="images/peach.svg" alt="Персик"></div>'
    '</div>'
).replace(
    '<div class="reel" id="reel-1">',
    '<div class="reel winner" id="reel-1">'
).replace(
    '<div class="reel" id="reel-2">',
    '<div class="reel winner" id="reel-2">'
).replace(
    '<div class="reel" id="reel-3">',
    '<div class="reel winner" id="reel-3">'
).replace('<script src="script.js"></script>', '')

win_path = os.path.join(lr10_dir, 'temp_win.html')
with open(win_path, 'w', encoding='utf-8') as f:
    f.write(html_win)

cmd2 = [
    edge, '--headless', '--disable-gpu',
    f'--screenshot={os.path.join(lr10_dir, "screenshot_lr10_win.png")}',
    '--window-size=850,600',
    f'file:///{win_path}'
]
subprocess.run(cmd2, timeout=10)

# 3. Pulling lever mid-game
html_pull = html_win.replace(
    '<div class="lever-track" id="lever-track" title="Потягніть важіль!">',
    '<div class="lever-track pulled" id="lever-track" title="Потягніть важіль!">'
).replace(
    '<div class="payline active" id="payline"></div>',
    '<div class="payline" id="payline"></div>'
).replace(
    '<div class="status-box" id="game-status" style="color: #00ff00;">🎉 ПЕРЕМОГА! Владислав вибив однаковий ряд!</div>',
    '<div class="status-box" id="game-status">Спроба 1 з 3: однаковий ряд не випав</div>'
).replace(
    '<button id="generate-btn" class="btn-generate" disabled>Generate</button>',
    '<button id="generate-btn" class="btn-generate">Generate</button>'
).replace(
    '<button id="restart-btn" class="btn-restart" style="display: inline-block;">Грати знову</button>',
    '<button id="restart-btn" class="btn-restart" style="display: none;">Грати знову</button>'
)

pull_path = os.path.join(lr10_dir, 'temp_pull.html')
with open(pull_path, 'w', encoding='utf-8') as f:
    f.write(html_pull)

cmd3 = [
    edge, '--headless', '--disable-gpu',
    f'--screenshot={os.path.join(lr10_dir, "screenshot_lr10_game.png")}',
    '--window-size=850,600',
    f'file:///{pull_path}'
]
subprocess.run(cmd3, timeout=10)

# Clean up
if os.path.exists(win_path):
    os.remove(win_path)
if os.path.exists(pull_path):
    os.remove(pull_path)

print('Screenshots generated successfully!')
