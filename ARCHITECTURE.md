# Rocks and Voids - Architecture & Implementation Guide

This document describes the architecture, design decisions, and implementation details for resuming development.

## Project Structure

```
rocks-and-voids/
├── index.html                    # Entry point, loads all scripts
├── css/
│   └── styles.css               # 3-panel layout styling
├── js/
│   ├── main.js                  # Application bootstrap
│   ├── config/
│   │   └── defaults.js          # Configuration constants
│   ├── core/
│   │   ├── Arena.js             # 3D space, boundaries, lighting
│   │   ├── EventBus.js          # Pub/sub messaging system
│   │   ├── ObjectRegistry.js    # Named object storage
│   │   └── Simulation.js        # Animation loop controller
│   ├── objects/
│   │   ├── SimObject.js         # Base class for all objects
│   │   ├── Camera.js            # Camera as SimObject (SimCamera)
│   │   ├── shapes/
│   │   │   ├── ShapeFactory.js  # Factory for creating shapes
│   │   │   ├── Sphere.js        # Sphere geometry
│   │   │   ├── Cube.js          # Cube geometry
│   │   │   └── Pyramid.js       # Pyramid (cone) geometry
│   │   └── lighting/
│   │       └── ObjectLight.js   # Point light attached to objects
│   ├── behaviors/
│   │   ├── Behavior.js          # Base behavior class
│   │   ├── BehaviorManager.js   # Behavior orchestration
│   │   ├── StillBehavior.js     # Stationary (no movement)
│   │   ├── OrbitBehavior.js     # Orbital motion
│   │   └── FollowBehavior.js    # Follow with min distance
│   ├── commands/
│   │   ├── CommandParser.js     # Tokenizer and parser
│   │   ├── CommandRegistry.js   # Command registration/dispatch
│   │   ├── CommandHistory.js    # Up/down navigation
│   │   ├── HelpGenerator.js     # --help output generation
│   │   └── commands/
│   │       ├── PlaceCommand.js
│   │       ├── CameraCommand.js
│   │       ├── StartCommand.js
│   │       ├── StopCommand.js
│   │       ├── ResetCommand.js
│   │       ├── ClearCommand.js
│   │       ├── ConfigCommand.js
│   │       └── ImportCommand.js
│   ├── ui/
│   │   ├── UIManager.js         # Panel coordination
│   │   ├── RenderPanel.js       # three.js canvas/renderer
│   │   ├── CommandPanel.js      # Chat input with history
│   │   └── StatusPanel.js       # Message display
│   └── utils/
│       ├── ColorUtils.js        # Named color → hex mapping
│       ├── VectorUtils.js       # Vector math helpers
│       └── TimeUtils.js         # Time string parsing
└── scripts/examples/            # Example script files
    ├── solar-system.txt
    ├── follow-demo.txt
    └── light-show.txt
```

## Design Decisions

### 1. Camera as Object
**Decision**: The camera is implemented as a SimObject subclass (SimCamera), allowing it to use the same positioning, behaviors, and command syntax as regular objects.

**Rationale**: Unified interface for all movable entities. Camera can orbit, follow, or have any behavior that objects support.

**Implementation**: `js/objects/Camera.js` - SimCamera extends SimObject and wraps a THREE.PerspectiveCamera.

### 2. Command Syntax
**Decision**: Natural language-style commands with flag-value pairs:
```
place medium red cube named "test" at (0,0,0)
object -orbits target -period 10s
```

**Rationale**: More readable than terse CLI syntax, easier for users to remember.

**Implementation**: `CommandParser.js` tokenizes input respecting quotes, extracts positional args and `-flag value` pairs.

### 3. Behavior System (Strategy Pattern)
**Decision**: Behaviors are separate classes that implement an `update(object, deltaTime)` method.

**Rationale**:
- Easy to add new behaviors without modifying existing code
- Behaviors can be swapped at runtime
- Clear separation of movement logic from object representation

**Implementation**: `js/behaviors/` - Base `Behavior` class with `StillBehavior`, `OrbitBehavior`, `FollowBehavior` implementations.

### 4. Global Singletons
**Decision**: Key systems are global singletons:
- `objectRegistry` - stores all named objects
- `commandRegistry` - command dispatch
- `behaviorManager` - behavior orchestration
- `simulation` - animation loop
- `eventBus` - pub/sub messaging

**Rationale**: Simple architecture for a client-side app. Avoids complex dependency injection while keeping modules decoupled.

**Trade-off**: Harder to test in isolation. Consider refactoring to dependency injection for testability.

### 5. Semicolon-Separated Commands
**Decision**: Multiple commands can be entered on one line separated by `;`.

**Implementation**: `CommandPanel.splitCommands()` parses respecting quoted strings.

### 6. Fixed Time Step Physics
**Decision**: Physics updates use a fixed time step (default 0.1s) with accumulator pattern.

**Rationale**: Consistent physics behavior regardless of frame rate.

**Implementation**: `Simulation.loop()` accumulates real time and runs fixed-step updates.

### 7. Object Sizes
**Decision**: Three named sizes (small/medium/large) with configurable base.

**Current defaults**:
- Base size: 10 meters
- Small: 2.5m (0.25x base)
- Medium: 10m (1.0x base)
- Large: 20m (2.0x base)

**Rationale**: Simpler than numeric sizes for casual use, but base is configurable for flexibility.

## Key Implementation Details

### Command Execution Flow

```
User Input
    ↓
CommandPanel.executeCommand()
    ↓
splitCommands(input)  →  ["cmd1", "cmd2", ...]
    ↓
For each command:
    ↓
executeSingleCommand(cmd)
    ↓
commandParser.parse(cmd)
    ↓
{name, positional, flags}
    ↓
commandRegistry.handleBehaviorCommand()  ← checks if cmd name is an object
    ↓ (if not object behavior)
commandRegistry.dispatch()
    ↓
CommandClass.validate()
    ↓
CommandClass.execute()
```

### Object Behavior Commands

When the command name matches an existing object (e.g., `sun -emits light`):
1. `handleBehaviorCommand()` intercepts before regular dispatch
2. Looks up object in registry
3. Applies behavior based on flags (-still, -orbits, -follows, -emits)

### Orbit Behavior Details

**OrbitBehavior** (`js/behaviors/OrbitBehavior.js`):
- Calculates orbit radius from initial position to target
- Updates angle based on angular velocity (2π / period)
- Recalculates position relative to target's CURRENT position each frame
- Orbits in XZ plane by default (horizontal)

**Important**: Set up all objects and positions BEFORE starting simulation to ensure correct orbit radii.

### Light Emission

**ObjectLight** (`js/objects/lighting/ObjectLight.js`):
- Creates THREE.PointLight matching object color
- Follows parent object position
- Supports oscillating intensity using sine wave

### Event Bus Events

```javascript
// Object events
'object:added'      // {object}
'object:removed'    // {object}

// Camera events
'camera:set'        // {camera}

// Simulation events
'simulation:started'
'simulation:stopped'
'simulation:reset'
'simulation:update' // {deltaTime}

// Arena events
'arena:resized'     // {size}

// Registry events
'registry:cleared'
```

## Known Issues & Future Work

### Current Issues

1. **Event listener binding**: Had issues with Safari and event listeners. Fixed by explicit method binding in CommandPanel constructor.

2. **Orbit timing**: Objects must be positioned correctly relative to targets before setting orbit behavior, or radius calculation will be wrong.

### Planned Features (Deferred)

1. **Export simulation state**: Save current state as script file
2. **Multiple cameras**: Switch between camera views
3. **Custom materials/textures**: Surface appearance options
4. **Path behavior**: Define movement along a path
5. **Collision detection**: Objects interacting

### Extension Points

**Adding a new shape:**
1. Create `js/objects/shapes/NewShape.js` with `create(options)` method
2. Register in `ShapeFactory.shapes`
3. Add script tag to `index.html`

**Adding a new behavior:**
1. Create `js/behaviors/NewBehavior.js` extending `Behavior`
2. Implement `update(object, deltaTime)`
3. Register in `BehaviorManager.behaviorTypes`
4. Add flag handling in `CommandRegistry.handleBehaviorCommand()`

**Adding a new command:**
1. Create `js/commands/commands/NewCommand.js` with:
   - `commandName`: string
   - `help`: object with description, syntax, flags, examples
   - `validate(parsed)`: returns {valid, error?}
   - `execute(parsed, context)`: returns {success, error?}
2. Register in `CommandRegistry`: `commandRegistry.register(NewCommand)`
3. Add script tag to `index.html`

## Configuration Reference

**js/config/defaults.js**:

```javascript
Config = {
    arena: {
        size: 1000,              // Arena size in meters
        backgroundColor: 0x000011 // Dark blue-black
    },
    simulation: {
        frameTime: 0.1           // Physics time step (seconds)
    },
    objects: {
        baseSize: 10,            // Medium size in meters
        sizeMultipliers: {
            small: 0.25,
            medium: 1.0,
            large: 2.0
        }
    },
    camera: {
        fov: 75,
        near: 0.1,
        far: 10000,
        defaultPosition: { x: 0, y: 50, z: 100 }
    },
    lighting: {
        ambient: { color: 0x404040, intensity: 0.5 },
        defaultPointLight: { intensity: 1.0, distance: 500, decay: 2 }
    }
}
```

## Testing

### Manual Testing Checklist

1. **Basic rendering**: Objects appear, correct colors/shapes
2. **Camera**: Position, lookat, behaviors work
3. **Behaviors**: still, orbits, follows
4. **Light emission**: Fixed and oscillating
5. **Commands**: All commands work with --help
6. **Semicolons**: Multiple commands on one line
7. **History**: Up/down arrow navigation
8. **Import**: Load script file
9. **Reset/Clear**: UI and objects cleared

### Test Scripts

Located in `scripts/examples/`:
- `solar-system.txt` - Orbiting planets
- `follow-demo.txt` - Following behavior chain
- `light-show.txt` - Oscillating lights

## Browser Compatibility

Tested on:
- Safari (macOS) - requires explicit method binding for event listeners
- Chrome (recommended)
- Firefox

Requires WebGL support for three.js rendering.
