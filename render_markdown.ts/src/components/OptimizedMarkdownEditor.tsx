import { useState, useCallback, memo, useMemo, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Input, Card, Divider, Switch, Typography, Spin } from 'antd';
import debounce from 'lodash.debounce';

const { TextArea } = Input;
const { Text } = Typography;

// 使用Web Worker进行异步渲染（模拟）
const useMarkdownWorker = (markdown: string) => {
  const [renderedContent, setRenderedContent] = useState<string>(markdown);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    
    // 使用setTimeout模拟Web Worker异步处理
    // 在实际应用中，可以使用真正的Web Worker来处理大型文档
    const timerId = setTimeout(() => {
      setRenderedContent(markdown);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timerId);
  }, [markdown]);

  return { renderedContent, isLoading };
};

// 使用memo优化性能，避免不必要的重渲染
const MarkdownPreview = memo(({ content, isLoading }: { content: string; isLoading: boolean }) => {
  // 使用useMemo缓存渲染结果
  const renderedMarkdown = useMemo(() => {
    return (
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    );
  }, [content]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin tip="渲染中..." />
      </div>
    );
  }

  return (
    <div className="markdown-preview overflow-auto p-4">
      {renderedMarkdown}
    </div>
  );
});

MarkdownPreview.displayName = 'MarkdownPreview';

const OptimizedMarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('# 欢迎使用优化版 Markdown 编辑器\n\n输入一些内容试试看...\n\n## 性能优化\n\n- 使用 memo 减少不必要的重渲染\n- 使用 useMemo 缓存渲染结果\n- 使用 useCallback 避免函数重复创建\n- 使用 debounce 减少更新频率\n- 模拟 Web Worker 异步渲染');
  const [livePreview, setLivePreview] = useState<boolean>(true);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const lastSavedContent = useRef(markdown);
  const { renderedContent, isLoading } = useMarkdownWorker(markdown);

  // 使用debounce减少频繁更新
  const debouncedSetMarkdown = useMemo(
    () => debounce((value: string) => {
      setMarkdown(value);
      if (autoSave) {
        // 模拟自动保存功能
        lastSavedContent.current = value;
        console.log('自动保存内容...');
      }
    }, 300),
    [autoSave]
  );

  // 使用useCallback优化handleInputChange函数
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (livePreview) {
      debouncedSetMarkdown(value);
    } else {
      // 不进行实时预览时，只更新输入内容，不渲染
      setMarkdown(value);
    }
  }, [livePreview, debouncedSetMarkdown]);

  // 手动更新预览
  const handleUpdatePreview = useCallback(() => {
    // 不需要额外操作，因为markdown状态已经更新
    console.log('手动更新预览');
  }, []);

  // 保存内容
  const handleSave = useCallback(() => {
    lastSavedContent.current = markdown;
    console.log('手动保存内容...');
  }, [markdown]);

  return (
    <div className="markdown-editor w-full max-w-6xl mx-auto">
      <div className="flex justify-end mb-2 gap-4">
        <div className="flex items-center">
          <Text className="mr-2">实时预览:</Text>
          <Switch checked={livePreview} onChange={setLivePreview} />
        </div>
        <div className="flex items-center">
          <Text className="mr-2">自动保存:</Text>
          <Switch checked={autoSave} onChange={setAutoSave} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          title="编辑区" 
          className="h-full" 
          extra={!livePreview && (
            <button 
              className="text-blue-500 hover:text-blue-700" 
              onClick={handleUpdatePreview}
            >
              更新预览
            </button>
          )}
        >
          <TextArea
            className="w-full h-96 resize-none font-mono"
            value={markdown}
            onChange={handleInputChange}
            placeholder="输入Markdown内容..."
            autoSize={{ minRows: 15, maxRows: 30 }}
          />
          <div className="flex justify-between mt-2">
            <Text type="secondary">
              {markdown.length} 字符 | {markdown.split('\n').length} 行
            </Text>
            <button 
              className="text-blue-500 hover:text-blue-700" 
              onClick={handleSave}
            >
              保存
            </button>
          </div>
        </Card>
        
        <Card title="预览区" className="h-full">
          <div className="h-96 overflow-auto">
            <MarkdownPreview content={renderedContent} isLoading={isLoading} />
          </div>
        </Card>
      </div>
      
      <Divider orientation="left">性能信息</Divider>
      <div className="bg-gray-100 p-4 rounded">
        <p>· 实时预览: {livePreview ? '开启' : '关闭'}</p>
        <p>· 自动保存: {autoSave ? '开启' : '关闭'}</p>
        <p>· 文档大小: {Math.round(markdown.length / 1024 * 100) / 100} KB</p>
        <p>· 渲染状态: {isLoading ? '渲染中...' : '渲染完成'}</p>
      </div>
    </div>
  );
};

export default OptimizedMarkdownEditor; 