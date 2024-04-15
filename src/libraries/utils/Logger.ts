import chalk from "chalk";
import moment from "moment";
import { dirname, join, relative, resolve, sep } from "path";
import { readdirSync, readFileSync } from "fs";

enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,

    // Miscellaneous levels
    EVENT = 4,
}

export class Logger {

    public readonly packageCache: Map<string, unknown> = new Map();
    
    /**
     * @param {string} content
     */
    info(content: string) {
        return this.write(LogLevel.INFO, content, this.getCaller({
            file: this.getCallerFile(),
            dir: dirname(this.getCallerFile()),
            root: this.getRootOf(dirname(this.getCallerFile()))
        }));
    }
    
    /**
     * @param {string} content
     */
    warn(content: string) {
        this.write(LogLevel.WARN, content, this.getCaller({
            file: this.getCallerFile(),
            dir: dirname(this.getCallerFile()),
            root: this.getRootOf(dirname(this.getCallerFile()))
        }));
    }
    
    /**
     * @param {string} content
     */
    error(content: string) {
        this.write(LogLevel.ERROR, content, this.getCaller({
            file: this.getCallerFile(),
            dir: dirname(this.getCallerFile()),
            root: this.getRootOf(dirname(this.getCallerFile()))
        }));
    }
    
    /**
     * @param {string} content
     */
    debug(content: string) {
        this.write(LogLevel.DEBUG, content, this.getCaller({
            file: this.getCallerFile(),
            dir: dirname(this.getCallerFile()),
            root: this.getRootOf(dirname(this.getCallerFile()))
        }));
    }

    /**
     * @param {string} content
     */
    event(content: string) {
        this.write(LogLevel.EVENT, content, this.getCaller({
            file: this.getCallerFile(),
            dir: dirname(this.getCallerFile()),
            root: this.getRootOf(dirname(this.getCallerFile()))
        }));
    }

    /**
     * @param {LogLevel} level
     * @param {string} content
     * @param {string} caller
     */
    private write(level: LogLevel, content: string, caller: string) {
        let prefix: string;

        switch (level) {
            case LogLevel.DEBUG:
                prefix = chalk.gray("DEBUG");
                break;
            case LogLevel.INFO:
                prefix = chalk.cyan("INFO ");
                break;
            case LogLevel.WARN:
                prefix = chalk.yellow("WARN ");
                break;
            case LogLevel.ERROR:
                prefix = chalk.red("ERROR");
                break;
            case LogLevel.EVENT:
                prefix = chalk.magenta("EVENT");
                break;
        }

        let time = moment().format("HH:mm:ss");
        time = chalk.gray(time);

        return console.log(`${time} ${prefix}  [${caller}] ${content}`);
    }

    /**
     * Get the caller of the function that called this function
     * Example: mythcord.libraries.structures.utils/Logger.js
     * @returns {string}
     */
    private getCaller({ file, dir, root }: { file?: string, dir?: string, root?: string }) {
        let pkgName = "<unknown>",
            pkgPath = "<unknown>",
            pkgMain = "";

        let callerFile = file ?? this.getCallerFile();
        const callerDir = dir ?? dirname(callerFile),
            projectRoot = root ?? this.getRootOf(callerDir),
            pkg = this.getInfo(projectRoot);

        if (pkg.awLoggerRoot != null) 
            pkgMain = pkg.awLoggerRoot;
        else if (pkg.main != null)
            pkgMain = dirname(pkg.main);

        const pkgBase = join(projectRoot, pkgMain);
        
        pkgName = pkg.name;
        pkgPath = relative(pkgBase, callerDir);
        pkgPath = pkgPath.replaceAll(sep, ".");

        // Now, we split the callerFile into an array using the separator "/"
        const callerFileParts = callerFile.split(sep);
        callerFile = callerFileParts[callerFileParts.length - 1].toString();

        pkgName = chalk.green(pkgName);
        pkgPath = pkgPath.replace("...dist.", "");
        callerFile = chalk.bold(callerFile);        
    
        return `${pkgName}\u001b[34m.${pkgPath}/${callerFile}\u001b[39m`;
    }

    /**
     * Returns the file that called this function.
     * Example: /home/kizu/Documents/Workspace/TypeScript/mythcord/dist/libraries/structures/utils/Logger.js
     * @returns {string}
     */
    private getCallerFile(): string {
        let callerFile: string = null;
        try {
            const capture: { stack?: string } = {};
            Error.captureStackTrace(capture);
            const splitStack = capture.stack.split("\n");

            splitStack.shift();

            const useLine = 2;
            let currentLine = 0;
            while (currentLine < useLine) {
                if (splitStack[1]?.trimLeft().startsWith('->')) {
                    splitStack.shift();
                }

                splitStack.shift();
                currentLine++;
            }

            const regex = /(?:at (?:.+?\()|at )(.+?):[0-9]+:[0-9]+/
            callerFile = regex.exec(splitStack[0])?.[1];
        } catch {
            // Do nothing :)
        }

        if (callerFile == null) 
            return null;

        return resolve(callerFile);
	}

    /**
     * Returns the root directory of the project.
     * @param directory 
     * @returns {string}
     */
    private getRootOf(directory: string) {
        // Find the next package.json file in the directory tree
        let files = readdirSync(directory);
        while (!files.includes("package.json")) {
            const up = join(directory, "..");

            // If there is no package.json we will get stuck at the root directory
            if (up === directory) {
                directory = null;
                break;
            }

            directory = up;
            files = readdirSync(directory);
        }
    
        return directory;
	}

    /**
     * Returns the package.json of the project.
     * @param rootDir 
     * @returns {any} JSON object of the package.json file
     */
    private getInfo(rootDir: string) {
        const packageFile = resolve(rootDir, "package.json");

        let pkg;
        if (this.packageCache.get(packageFile) == null) {
            pkg = JSON.parse(readFileSync(packageFile, { encoding: "utf8" }));
            this.packageCache.set(packageFile, pkg);
        } else {
            pkg = this.packageCache.get(packageFile);
        }

        return pkg;
	}

}
