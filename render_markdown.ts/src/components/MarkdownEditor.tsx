import { useState, useCallback, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Card, CardContent, CardHeader, TextField, Box } from '@mui/material';

// 使用memo优化性能，避免不必要的重渲染
const MarkdownPreview = memo(({ content }: { content: string }) => {
  return (
    <div className="markdown-preview overflow-auto p-4">
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownPreview.displayName = 'MarkdownPreview';

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('# 欢迎使用 Markdown 编辑器\n\n输入一些内容试试看...');

  // 使用useCallback优化handleInputChange函数
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="编辑区" />
            <CardContent>
              <TextField
                fullWidth
                multiline
                minRows={15}
                maxRows={30}
                value={markdown}
                onChange={handleInputChange}
                placeholder="输入Markdown内容..."
                sx={{ height: '24rem' }}
              />
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="预览区" />
            <CardContent sx={{ height: '24rem', overflow: 'auto' }}>
              <MarkdownPreview content={markdown} />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default MarkdownEditor; 