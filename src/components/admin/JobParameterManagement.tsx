import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Code,
  Users,
  Globe,
  GraduationCap,
  Calendar,
  Search
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function JobParameterManagement() {
  const [activeTab, setActiveTab] = useState('skills');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Mock data for different parameters
  const [parameters, setParameters] = useState({
    skills: [
      { id: '1', name: 'JavaScript', category: 'Programming', usage: 45, status: 'active' },
      { id: '2', name: 'React', category: 'Frontend', usage: 38, status: 'active' },
      { id: '3', name: 'Node.js', category: 'Backend', usage: 32, status: 'active' },
      { id: '4', name: 'Python', category: 'Programming', usage: 41, status: 'active' },
      { id: '5', name: 'Data Analysis', category: 'Analytics', usage: 28, status: 'active' },
      { id: '6', name: 'Project Management', category: 'Management', usage: 35, status: 'active' },
      { id: '7', name: 'Digital Marketing', category: 'Marketing', usage: 25, status: 'active' },
      { id: '8', name: 'UI/UX Design', category: 'Design', usage: 22, status: 'active' }
    ],
    employeeTypes: [
      { id: '1', name: 'Full Time', description: 'Regular full-time employee', usage: 156, status: 'active' },
      { id: '2', name: 'Part Time', description: 'Part-time employee', usage: 78, status: 'active' },
      { id: '3', name: 'Contract', description: 'Contract-based employment', usage: 45, status: 'active' },
      { id: '4', name: 'Internship', description: 'Internship opportunity', usage: 32, status: 'active' },
      { id: '5', name: 'Freelance', description: 'Freelance/Project-based', usage: 28, status: 'active' },
      { id: '6', name: 'Remote', description: 'Remote work position', usage: 89, status: 'active' }
    ],
    languages: [
      { id: '1', name: 'English', level: 'Required', usage: 198, status: 'active' },
      { id: '2', name: 'Nepali', level: 'Native', usage: 201, status: 'active' },
      { id: '3', name: 'Hindi', level: 'Preferred', usage: 67, status: 'active' },
      { id: '4', name: 'Chinese', level: 'Preferred', usage: 23, status: 'active' },
      { id: '5', name: 'Japanese', level: 'Preferred', usage: 18, status: 'active' },
      { id: '6', name: 'Korean', level: 'Preferred', usage: 15, status: 'active' }
    ],
    jobLevels: [
      { id: '1', name: 'Entry Level', description: '0-2 years experience', usage: 89, status: 'active' },
      { id: '2', name: 'Mid Level', description: '2-5 years experience', usage: 76, status: 'active' },
      { id: '3', name: 'Senior Level', description: '5-8 years experience', usage: 54, status: 'active' },
      { id: '4', name: 'Lead Level', description: '8-12 years experience', usage: 32, status: 'active' },
      { id: '5', name: 'Executive Level', description: '12+ years experience', usage: 18, status: 'active' },
      { id: '6', name: 'Internship', description: 'Student/Fresh graduate', usage: 41, status: 'active' }
    ],
    experience: [
      { id: '1', name: 'Fresher', range: '0 years', usage: 78, status: 'active' },
      { id: '2', name: '1-2 years', range: '1-2 years', usage: 89, status: 'active' },
      { id: '3', name: '2-3 years', range: '2-3 years', usage: 76, status: 'active' },
      { id: '4', name: '3-5 years', range: '3-5 years', usage: 65, status: 'active' },
      { id: '5', name: '5-7 years', range: '5-7 years', usage: 45, status: 'active' },
      { id: '6', name: '7-10 years', range: '7-10 years', usage: 32, status: 'active' },
      { id: '7', name: '10+ years', range: '10+ years', usage: 28, status: 'active' }
    ]
  });

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: '',
    level: '',
    range: ''
  });

  const parameterConfigs = {
    skills: {
      title: 'Skills Management',
      description: 'Manage skill requirements and categories',
      icon: Code,
      fields: ['name', 'category'],
      columns: ['Skill', 'Category', 'Usage', 'Status', 'Actions']
    },
    employeeTypes: {
      title: 'Employee Types',
      description: 'Manage employment types and classifications',
      icon: Users,
      fields: ['name', 'description'],
      columns: ['Type', 'Description', 'Usage', 'Status', 'Actions']
    },
    languages: {
      title: 'Languages',
      description: 'Manage language requirements',
      icon: Globe,
      fields: ['name', 'level'],
      columns: ['Language', 'Level', 'Usage', 'Status', 'Actions']
    },
    jobLevels: {
      title: 'Job Levels',
      description: 'Manage job hierarchy levels',
      icon: GraduationCap,
      fields: ['name', 'description'],
      columns: ['Level', 'Description', 'Usage', 'Status', 'Actions']
    },
    experience: {
      title: 'Experience Ranges',
      description: 'Manage experience requirements',
      icon: Calendar,
      fields: ['name', 'range'],
      columns: ['Experience', 'Range', 'Usage', 'Status', 'Actions']
    }
  };

  const currentConfig = parameterConfigs[activeTab as keyof typeof parameterConfigs];
  const currentData = parameters[activeTab as keyof typeof parameters];

  const filteredData = currentData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = () => {
    if (!newItem.name) {
      toast.error('Name is required');
      return;
    }

    const item = {
      id: Date.now().toString(),
      ...newItem,
      usage: 0,
      status: 'active'
    };

    setParameters(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab as keyof typeof prev], item]
    }));

    setNewItem({
      name: '',
      description: '',
      category: '',
      level: '',
      range: ''
    });
    setIsAddDialogOpen(false);
    toast.success(`${currentConfig.title} item added successfully!`);
  };

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
  };

  const handleUpdate = () => {
    if (!editingItem || !editingItem.name) {
      toast.error('Name is required');
      return;
    }

    setParameters(prev => ({
      ...prev,
      [activeTab]: prev[activeTab as keyof typeof prev].map(item =>
        item.id === editingItem.id ? editingItem : item
      )
    }));

    setEditingItem(null);
    toast.success(`${currentConfig.title} item updated successfully!`);
  };

  const handleDelete = (id: string) => {
    setParameters(prev => ({
      ...prev,
      [activeTab]: prev[activeTab as keyof typeof prev].filter(item => item.id !== id)
    }));
    toast.success(`${currentConfig.title} item deleted successfully!`);
  };

  const toggleStatus = (id: string) => {
    setParameters(prev => ({
      ...prev,
      [activeTab]: prev[activeTab as keyof typeof prev].map(item =>
        item.id === id 
          ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
          : item
      )
    }));
    toast.success('Status updated successfully!');
  };

  const renderTableRow = (item: any) => {
    switch (activeTab) {
      case 'skills':
        return (
          <tr key={item.id} className="border-b hover:bg-gray-50">
            <td className="py-3 px-4 font-medium">{item.name}</td>
            <td className="py-3 px-4">
              <Badge variant="outline">{item.category}</Badge>
            </td>
            <td className="py-3 px-4">{item.usage} jobs</td>
            <td className="py-3 px-4">
              <Badge className={item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {item.status}
              </Badge>
            </td>
            <td className="py-3 px-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleStatus(item.id)}
                  className={item.status === 'active' ? 'text-red-600' : 'text-green-600'}
                >
                  {item.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        );

      case 'employeeTypes':
      case 'jobLevels':
        return (
          <tr key={item.id} className="border-b hover:bg-gray-50">
            <td className="py-3 px-4 font-medium">{item.name}</td>
            <td className="py-3 px-4 text-sm text-gray-600">{item.description}</td>
            <td className="py-3 px-4">{item.usage} jobs</td>
            <td className="py-3 px-4">
              <Badge className={item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {item.status}
              </Badge>
            </td>
            <td className="py-3 px-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleStatus(item.id)}
                  className={item.status === 'active' ? 'text-red-600' : 'text-green-600'}
                >
                  {item.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        );

      case 'languages':
        return (
          <tr key={item.id} className="border-b hover:bg-gray-50">
            <td className="py-3 px-4 font-medium">{item.name}</td>
            <td className="py-3 px-4">
              <Badge variant="outline">{item.level}</Badge>
            </td>
            <td className="py-3 px-4">{item.usage} jobs</td>
            <td className="py-3 px-4">
              <Badge className={item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {item.status}
              </Badge>
            </td>
            <td className="py-3 px-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleStatus(item.id)}
                  className={item.status === 'active' ? 'text-red-600' : 'text-green-600'}
                >
                  {item.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        );

      case 'experience':
        return (
          <tr key={item.id} className="border-b hover:bg-gray-50">
            <td className="py-3 px-4 font-medium">{item.name}</td>
            <td className="py-3 px-4">
              <Badge variant="outline">{item.range}</Badge>
            </td>
            <td className="py-3 px-4">{item.usage} jobs</td>
            <td className="py-3 px-4">
              <Badge className={item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {item.status}
              </Badge>
            </td>
            <td className="py-3 px-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleStatus(item.id)}
                  className={item.status === 'active' ? 'text-red-600' : 'text-green-600'}
                >
                  {item.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        );

      default:
        return null;
    }
  };

  const renderAddForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="itemName">Name</Label>
        <Input
          id="itemName"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder={`Enter ${activeTab.slice(0, -1)} name`}
        />
      </div>

      {currentConfig.fields.includes('description') && (
        <div className="space-y-2">
          <Label htmlFor="itemDescription">Description</Label>
          <Textarea
            id="itemDescription"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            placeholder="Enter description"
            rows={3}
          />
        </div>
      )}

      {currentConfig.fields.includes('category') && (
        <div className="space-y-2">
          <Label htmlFor="itemCategory">Category</Label>
          <Input
            id="itemCategory"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            placeholder="Enter category"
          />
        </div>
      )}

      {currentConfig.fields.includes('level') && (
        <div className="space-y-2">
          <Label htmlFor="itemLevel">Level</Label>
          <select
            id="itemLevel"
            value={newItem.level}
            onChange={(e) => setNewItem({ ...newItem, level: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select level</option>
            <option value="Required">Required</option>
            <option value="Preferred">Preferred</option>
            <option value="Native">Native</option>
            <option value="Basic">Basic</option>
            <option value="Fluent">Fluent</option>
          </select>
        </div>
      )}

      {currentConfig.fields.includes('range') && (
        <div className="space-y-2">
          <Label htmlFor="itemRange">Range</Label>
          <Input
            id="itemRange"
            value={newItem.range}
            onChange={(e) => setNewItem({ ...newItem, range: e.target.value })}
            placeholder="e.g., 5-7 years"
          />
        </div>
      )}
    </div>
  );

  const renderEditForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="editItemName">Name</Label>
        <Input
          id="editItemName"
          value={editingItem?.name || ''}
          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
        />
      </div>

      {currentConfig.fields.includes('description') && (
        <div className="space-y-2">
          <Label htmlFor="editItemDescription">Description</Label>
          <Textarea
            id="editItemDescription"
            value={editingItem?.description || ''}
            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
            rows={3}
          />
        </div>
      )}

      {currentConfig.fields.includes('category') && (
        <div className="space-y-2">
          <Label htmlFor="editItemCategory">Category</Label>
          <Input
            id="editItemCategory"
            value={editingItem?.category || ''}
            onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
          />
        </div>
      )}

      {currentConfig.fields.includes('level') && (
        <div className="space-y-2">
          <Label htmlFor="editItemLevel">Level</Label>
          <select
            id="editItemLevel"
            value={editingItem?.level || ''}
            onChange={(e) => setEditingItem({ ...editingItem, level: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select level</option>
            <option value="Required">Required</option>
            <option value="Preferred">Preferred</option>
            <option value="Native">Native</option>
            <option value="Basic">Basic</option>
            <option value="Fluent">Fluent</option>
          </select>
        </div>
      )}

      {currentConfig.fields.includes('range') && (
        <div className="space-y-2">
          <Label htmlFor="editItemRange">Range</Label>
          <Input
            id="editItemRange"
            value={editingItem?.range || ''}
            onChange={(e) => setEditingItem({ ...editingItem, range: e.target.value })}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Job Parameter Management</h2>
          <p className="text-gray-600">Manage job-related parameters, skills, and requirements</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="employeeTypes">Employee Types</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="jobLevels">Job Levels</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
        </TabsList>

        {Object.keys(parameterConfigs).map(tabKey => (
          <TabsContent key={tabKey} value={tabKey} className="space-y-6">
            {/* Tab Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    {React.createElement(parameterConfigs[tabKey as keyof typeof parameterConfigs].icon, { className: "h-8 w-8 text-blue-600" })}
                    <div>
                      <h3 className="text-lg font-semibold">{currentConfig.title}</h3>
                      <p className="text-sm text-gray-600">{currentConfig.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add {tabKey.slice(0, -1)}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add {currentConfig.title.slice(0, -1)}</DialogTitle>
                          <DialogDescription>
                            Create a new {tabKey.slice(0, -1)} entry.
                          </DialogDescription>
                        </DialogHeader>
                        {renderAddForm()}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAdd}>Add</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Items</p>
                      <p className="text-2xl font-bold text-blue-600">{currentData.length}</p>
                    </div>
                    <Settings className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-green-600">
                        {currentData.filter(item => item.status === 'active').length}
                      </p>
                    </div>
                    <Settings className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Most Used</p>
                      <p className="text-lg font-bold text-purple-600">
                        {currentData.reduce((max, item) => item.usage > max.usage ? item : max, currentData[0])?.name || 'N/A'}
                      </p>
                    </div>
                    <Settings className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Usage</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {currentData.reduce((sum, item) => sum + item.usage, 0)}
                      </p>
                    </div>
                    <Settings className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>{currentConfig.title} ({filteredData.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        {currentConfig.columns.map(column => (
                          <th key={column} className="text-left py-3 px-4">{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map(item => renderTableRow(item))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {currentConfig.title.slice(0, -1)}</DialogTitle>
            <DialogDescription>
              Update the {activeTab.slice(0, -1)} information.
            </DialogDescription>
          </DialogHeader>
          {renderEditForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}