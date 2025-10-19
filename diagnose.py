#!/usr/bin/env python3
"""
Document Tweaker - Diagnostic Tool
Automatically diagnose and fix common setup issues
"""

import os
import sys
import subprocess
from pathlib import Path
import platform


# Colors for terminal output
class Colors:
    HEADER = "\033[95m"
    OKBLUE = "\033[94m"
    OKCYAN = "\033[96m"
    OKGREEN = "\033[92m"
    WARNING = "\033[93m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"


def print_colored(text, color=Colors.OKGREEN):
    """Print colored text"""
    print(f"{color}{text}{Colors.ENDC}")


def print_header(text):
    """Print section header"""
    print("\n" + "=" * 80)
    print_colored(f"  {text}", Colors.HEADER + Colors.BOLD)
    print("=" * 80)


def run_command(command, capture_output=True):
    """Run shell command and return output"""
    try:
        result = subprocess.run(
            command, shell=True, capture_output=capture_output, text=True, timeout=30
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timeout"
    except Exception as e:
        return False, "", str(e)


def check_python():
    """Check Python installation and version"""
    print_header("1. Checking Python")

    version = sys.version_info
    version_str = f"{version.major}.{version.minor}.{version.micro}"

    if version.major >= 3 and version.minor >= 9:
        print_colored(f"✓ Python {version_str} - OK", Colors.OKGREEN)
        return True
    else:
        print_colored(f"✗ Python {version_str} - Need 3.9 or higher", Colors.FAIL)
        print("\nDownload Python from: https://www.python.org/downloads/")
        return False


def check_node():
    """Check Node.js installation"""
    print_header("2. Checking Node.js")

    success, stdout, stderr = run_command("node --version")

    if success:
        version = stdout.strip()
        print_colored(f"✓ Node.js {version} - OK", Colors.OKGREEN)
        return True
    else:
        print_colored("✗ Node.js not found", Colors.FAIL)
        print("\nDownload Node.js from: https://nodejs.org/")
        return False


def check_venv():
    """Check virtual environment"""
    print_header("3. Checking Virtual Environment")

    venv_path = Path("venv")

    if venv_path.exists():
        print_colored("✓ Virtual environment exists", Colors.OKGREEN)

        # Check if it's activated
        if hasattr(sys, "real_prefix") or (
            hasattr(sys, "base_prefix") and sys.base_prefix != sys.prefix
        ):
            print_colored("✓ Virtual environment is activated", Colors.OKGREEN)
            return True
        else:
            print_colored(
                "⚠ Virtual environment exists but not activated", Colors.WARNING
            )
            print("\nTo activate:")
            if platform.system() == "Windows":
                print("  venv\\Scripts\\activate")
            else:
                print("  source venv/bin/activate")
            return False
    else:
        print_colored("✗ Virtual environment not found", Colors.FAIL)
        print("\nCreating virtual environment...")

        success, _, _ = run_command(f"{sys.executable} -m venv venv")

        if success:
            print_colored("✓ Virtual environment created!", Colors.OKGREEN)
            print("\nActivate it:")
            if platform.system() == "Windows":
                print("  venv\\Scripts\\activate")
            else:
                print("  source venv/bin/activate")
            return False
        else:
            print_colored("✗ Failed to create virtual environment", Colors.FAIL)
            return False


def check_env_file():
    """Check .env configuration"""
    print_header("4. Checking .env Configuration")

    env_path = Path(".env")
    env_example = Path(".env.example")

    if not env_path.exists():
        print_colored("✗ .env file not found", Colors.FAIL)

        if env_example.exists():
            print("\nAttempting to create .env from .env.example...")
            try:
                with open(env_example, "r") as src:
                    content = src.read()
                with open(env_path, "w") as dst:
                    dst.write(content)
                print_colored("✓ Created .env file", Colors.OKGREEN)
            except Exception as e:
                print_colored(f"✗ Failed to create .env: {e}", Colors.FAIL)
                return False
        else:
            print_colored("✗ .env.example also not found", Colors.FAIL)
            return False

    # Check API keys
    with open(env_path, "r") as f:
        content = f.read()

    issues = []

    # Check Unstract key
    if "UNSTRACT_API_KEY=" not in content:
        issues.append("Missing UNSTRACT_API_KEY")
    elif "your_unstract_api_key_here" in content:
        issues.append("UNSTRACT_API_KEY not configured (still placeholder)")
    else:
        for line in content.split("\n"):
            if line.startswith("UNSTRACT_API_KEY="):
                key = line.split("=", 1)[1].strip()
                if len(key) > 10:
                    print_colored(f"✓ UNSTRACT_API_KEY configured", Colors.OKGREEN)
                break

    # Check Gemini key
    if "GEMINI_API_KEY=" not in content:
        issues.append("Missing GEMINI_API_KEY")
    elif "your_gemini_api_key_here" in content:
        issues.append("GEMINI_API_KEY not configured (still placeholder)")
    else:
        for line in content.split("\n"):
            if line.startswith("GEMINI_API_KEY="):
                key = line.split("=", 1)[1].strip()
                if len(key) > 10:
                    print_colored(f"✓ GEMINI_API_KEY configured", Colors.OKGREEN)
                break

    if issues:
        print_colored("✗ Issues found:", Colors.FAIL)
        for issue in issues:
            print(f"  • {issue}")
        print("\nPlease edit .env file and add your API keys:")
        print("  • Unstract: https://unstract.com/")
        print("  • Gemini: https://makersuite.google.com/app/apikey")
        return False

    return True


def check_python_packages():
    """Check Python packages"""
    print_header("5. Checking Python Packages")

    requirements = Path("requirements.txt")

    if not requirements.exists():
        print_colored("✗ requirements.txt not found", Colors.FAIL)
        return False

    # Try importing key packages
    packages = {
        "flask": "Flask",
        "flask_cors": "flask-cors",
        "google.generativeai": "google-generativeai",
        "requests": "requests",
    }

    missing = []

    for module_name, package_name in packages.items():
        try:
            __import__(module_name)
            print_colored(f"✓ {package_name}", Colors.OKGREEN)
        except ImportError:
            print_colored(f"✗ {package_name} not installed", Colors.FAIL)
            missing.append(package_name)

    if missing:
        print_colored("\n⚠ Missing packages detected", Colors.WARNING)
        print("\nAttempting to install missing packages...")

        success, _, _ = run_command(
            f"{sys.executable} -m pip install -r requirements.txt"
        )

        if success:
            print_colored("✓ Packages installed successfully!", Colors.OKGREEN)
            return True
        else:
            print_colored("✗ Failed to install packages", Colors.FAIL)
            print("\nManual installation:")
            print(f"  {sys.executable} -m pip install -r requirements.txt")
            return False

    return True


def check_node_modules():
    """Check Node.js modules"""
    print_header("6. Checking Node.js Modules")

    node_modules = Path("node_modules")
    package_json = Path("package.json")

    if not package_json.exists():
        print_colored("✗ package.json not found", Colors.FAIL)
        return False

    if not node_modules.exists():
        print_colored("✗ node_modules not found", Colors.FAIL)
        print("\nAttempting to install Node.js dependencies...")

        success, _, _ = run_command("npm install")

        if success:
            print_colored("✓ Node modules installed successfully!", Colors.OKGREEN)
            return True
        else:
            print_colored("✗ Failed to install Node modules", Colors.FAIL)
            print("\nManual installation:")
            print("  npm install")
            return False
    else:
        print_colored("✓ node_modules directory exists", Colors.OKGREEN)
        return True


def check_directories():
    """Check required directories"""
    print_header("7. Checking Required Directories")

    required_dirs = ["uploads", "processed"]

    for dir_name in required_dirs:
        dir_path = Path(dir_name)
        if dir_path.exists():
            print_colored(f"✓ {dir_name}/ exists", Colors.OKGREEN)
        else:
            print_colored(f"⚠ {dir_name}/ not found, creating...", Colors.WARNING)
            try:
                dir_path.mkdir(exist_ok=True)
                print_colored(f"✓ {dir_name}/ created", Colors.OKGREEN)
            except Exception as e:
                print_colored(f"✗ Failed to create {dir_name}/: {e}", Colors.FAIL)
                return False

    return True


def check_ports():
    """Check if required ports are available"""
    print_header("8. Checking Port Availability")

    ports = {5000: "Backend (Flask)", 5173: "Frontend (Vite)"}

    all_available = True

    for port, service in ports.items():
        if platform.system() == "Windows":
            cmd = f"netstat -ano | findstr :{port}"
        else:
            cmd = f"lsof -i :{port}"

        success, stdout, _ = run_command(cmd)

        if stdout.strip():
            print_colored(f"⚠ Port {port} ({service}) is in use", Colors.WARNING)
            print(f"  Another process is using this port")
            all_available = False
        else:
            print_colored(f"✓ Port {port} ({service}) is available", Colors.OKGREEN)

    return all_available


def test_backend_import():
    """Test if backend can be imported"""
    print_header("9. Testing Backend Import")

    backend_file = Path("backend_api.py")

    if not backend_file.exists():
        print_colored("✗ backend_api.py not found", Colors.FAIL)
        return False

    try:
        # Try to import the module
        import importlib.util

        spec = importlib.util.spec_from_file_location("backend_api", backend_file)
        if spec and spec.loader:
            print_colored("✓ backend_api.py can be imported", Colors.OKGREEN)
            return True
        else:
            print_colored("✗ Failed to load backend_api.py", Colors.FAIL)
            return False
    except Exception as e:
        print_colored(f"✗ Import error: {str(e)}", Colors.FAIL)
        return False


def generate_report(results):
    """Generate diagnostic report"""
    print_header("Diagnostic Report")

    total = len(results)
    passed = sum(1 for _, result in results if result)

    print()
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        color = Colors.OKGREEN if result else Colors.FAIL
        print_colored(f"{status:8} - {test_name}", color)

    print("\n" + "=" * 80)
    print_colored(
        f"  Results: {passed}/{total} checks passed", Colors.HEADER + Colors.BOLD
    )
    print("=" * 80)

    return passed == total


def provide_solutions():
    """Provide solutions for common issues"""
    print_header("Common Solutions")

    print("""
1. API Keys Not Configured:
   • Edit .env file (use notepad .env)
   • Get Unstract key: https://unstract.com/
   • Get Gemini key: https://makersuite.google.com/app/apikey

2. Virtual Environment Issues:
   • Windows: venv\\Scripts\\activate
   • Mac/Linux: source venv/bin/activate

3. Missing Dependencies:
   • Python: pip install -r requirements.txt
   • Node.js: npm install

4. Port Already in Use:
   • Close other applications using the port
   • Or change port in configuration

5. Import Errors:
   • Make sure you're in the correct directory
   • Verify all files are present
   • Check file permissions

6. Backend Won't Start:
   • Check .env file exists
   • Verify API keys are set
   • Look at error messages in console

7. Frontend Won't Start:
   • Run npm install
   • Delete node_modules and reinstall
   • Check Node.js version (need 18+)
    """)


def main():
    """Main diagnostic function"""
    print_colored(
        """
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║          Document Tweaker - Diagnostic Tool                      ║
║          Automatically check and fix setup issues                ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    """,
        Colors.HEADER + Colors.BOLD,
    )

    # Run all checks
    results = [
        ("Python Installation", check_python()),
        ("Node.js Installation", check_node()),
        ("Virtual Environment", check_venv()),
        ("Environment Configuration", check_env_file()),
        ("Python Packages", check_python_packages()),
        ("Node.js Modules", check_node_modules()),
        ("Required Directories", check_directories()),
        ("Port Availability", check_ports()),
        ("Backend Import", test_backend_import()),
    ]

    # Generate report
    all_passed = generate_report(results)

    if all_passed:
        print_colored(
            """
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║  🎉 SUCCESS! All checks passed!                                  ║
║                                                                  ║
║  Your setup is complete and ready to use.                        ║
║                                                                  ║
║  Next steps:                                                     ║
║  1. Run: python backend_api.py                                   ║
║  2. In another terminal: npm run dev                             ║
║  3. Open: http://localhost:5173/enhanced-doc-tweaker             ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
        """,
            Colors.OKGREEN + Colors.BOLD,
        )
        return 0
    else:
        print_colored(
            """
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║  ⚠ ISSUES FOUND! See solutions below.                            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
        """,
            Colors.WARNING + Colors.BOLD,
        )

        provide_solutions()

        print("\n" + "=" * 80)
        print("Need more help? Check these files:")
        print("  • QUICK_START.md - 5-minute setup guide")
        print("  • SETUP_GUIDE.md - Detailed instructions")
        print("  • README_NEW.md - Complete documentation")
        print("=" * 80 + "\n")

        return 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print_colored("\n\nDiagnostic interrupted by user.", Colors.WARNING)
        sys.exit(1)
    except Exception as e:
        print_colored(f"\n\nUnexpected error: {str(e)}", Colors.FAIL)
        import traceback

        traceback.print_exc()
        sys.exit(1)
