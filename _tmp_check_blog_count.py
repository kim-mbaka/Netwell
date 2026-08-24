from pathlib import Path
text = Path(r'c:\Users\HomePC\Projects\Netwell\backend\netwellapp\management\commands\populate_data.py').read_text(encoding='utf-8')
start = text.index('blog_posts = [')
end = text.index('\n\n        # Create about page', start)
block = text[start:end]
count = block.count("'title':")
print(f'blog_posts_count={count}')
