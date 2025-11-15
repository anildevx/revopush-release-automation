# Contributing to React Native CI/CD with RevoPush

Thank you for considering contributing to this project! This guide will help you get started.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in [GitHub Issues](../../issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment details (OS, Node version, etc.)
   - Relevant logs or screenshots

### Suggesting Enhancements

We welcome suggestions for:
- New workflow configurations
- Support for additional deployment platforms
- Documentation improvements
- Performance optimizations
- Better error handling

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/your-fork.git
   cd your-fork
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Test your changes thoroughly
   - Update documentation if needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `chore:` for maintenance tasks
   - `refactor:` for code refactoring

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Submit for review

## Development Guidelines

### Workflow Files

When modifying GitHub Actions workflows:
- Test locally using [act](https://github.com/nektos/act) if possible
- Ensure workflows are efficient (minimize API calls)
- Add proper error handling
- Include helpful comments
- Update README.md if adding new workflows

### Scripts

For bash scripts:
- Make them cross-platform compatible (macOS/Linux)
- Add error handling (`set -e`)
- Include validation checks
- Add helpful echo messages
- Keep them simple and focused

### Documentation

- Keep README.md up to date
- Add inline comments for complex logic
- Provide examples for new features
- Update troubleshooting section for known issues

## Testing

Before submitting a PR:

1. **Test version scripts locally**
   ```bash
   ./scripts/bump_build_number.sh
   ./scripts/bump_version.sh
   ```

2. **Verify workflow syntax**
   - Use YAML validators
   - Check GitHub Actions documentation

3. **Test in a fork**
   - Push changes to your fork
   - Verify workflows run successfully
   - Check notifications work

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Spam or off-topic content
- Publishing others' private information

## Questions?

- Open a [Discussion](../../discussions) for general questions
- Use [Issues](../../issues) for bug reports
- Check existing documentation first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes (for significant contributions)
- README acknowledgments section

Thank you for helping make this project better!
