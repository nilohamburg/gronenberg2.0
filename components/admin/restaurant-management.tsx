"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { Pencil, Plus, Search, Trash, Leaf, Milk, Wheat } from "lucide-react"
import {
  getMenuCategories,
  getMenuItems,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuCategory,
  type MenuItem,
} from "@/actions/menu"

export function RestaurantManagement() {
  const router = useRouter()
  const { isAuthenticated } = useAdminAuth()
  const [activeTab, setActiveTab] = useState("categories")
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCategories, setFilteredCategories] = useState<MenuCategory[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])

  // Category form state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    id: 0,
    name: "",
    description: "",
    order_index: 0,
  })

  // Menu item form state
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
  const [isDeleteItemDialogOpen, setIsDeleteItemDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [itemForm, setItemForm] = useState({
    id: 0,
    category_id: 0,
    name: "",
    description: "",
    price: "",
    is_vegan: false,
    is_lactose_free: false,
    is_gluten_free: false,
    image: "",
    order_index: 0,
  })

  // Load categories and menu items
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        const categoriesData = await getMenuCategories()
        const menuItemsData = await getMenuItems()

        setCategories(categoriesData)
        setFilteredCategories(categoriesData)
        setMenuItems(menuItemsData)
        setFilteredItems(menuItemsData)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated, router])

  // Filter categories and menu items based on search query
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()

      // Filter categories
      const filteredCats = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(query) ||
          (category.description && category.description.toLowerCase().includes(query)),
      )
      setFilteredCategories(filteredCats)

      // Filter menu items
      const filteredMenuItems = menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.categoryName.toLowerCase().includes(query),
      )
      setFilteredItems(filteredMenuItems)
    } else {
      setFilteredCategories(categories)
      setFilteredItems(menuItems)
    }
  }, [searchQuery, categories, menuItems])

  // Category handlers
  const handleAddCategory = () => {
    setCategoryForm({
      id: 0,
      name: "",
      description: "",
      order_index: categories.length,
    })
    setSelectedCategory(null)
    setIsCategoryDialogOpen(true)
  }

  const handleEditCategory = (category: MenuCategory) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
      description: category.description || "",
      order_index: category.order_index,
    })
    setSelectedCategory(category)
    setIsCategoryDialogOpen(true)
  }

  const handleDeleteCategory = (category: MenuCategory) => {
    setSelectedCategory(category)
    setIsDeleteCategoryDialogOpen(true)
  }

  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return

    try {
      await deleteMenuCategory(selectedCategory.id)
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id))
      setIsDeleteCategoryDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
  }

  const handleSaveCategory = async () => {
    try {
      if (categoryForm.id === 0) {
        // Create new category
        const { id } = await createMenuCategory({
          name: categoryForm.name,
          description: categoryForm.description,
          order_index: categoryForm.order_index,
        })

        const newCategory = { ...categoryForm, id }
        setCategories((prev) => [...prev, newCategory])
      } else {
        // Update existing category
        await updateMenuCategory(categoryForm as MenuCategory)
        setCategories((prev) => prev.map((c) => (c.id === categoryForm.id ? (categoryForm as MenuCategory) : c)))
      }

      setIsCategoryDialogOpen(false)
    } catch (error) {
      console.error("Failed to save category:", error)
    }
  }

  // Menu item handlers
  const handleAddItem = () => {
    setItemForm({
      id: 0,
      category_id: categories.length > 0 ? categories[0].id : 0,
      name: "",
      description: "",
      price: "",
      is_vegan: false,
      is_lactose_free: false,
      is_gluten_free: false,
      image: "",
      order_index: menuItems.filter((item) => item.category_id === (categories.length > 0 ? categories[0].id : 0))
        .length,
    })
    setSelectedItem(null)
    setIsItemDialogOpen(true)
  }

  const handleEditItem = (item: any) => {
    setItemForm({
      id: item.id,
      category_id: item.category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      is_vegan: item.is_vegan,
      is_lactose_free: item.is_lactose_free,
      is_gluten_free: item.is_gluten_free,
      image: item.image || "",
      order_index: item.order_index,
    })
    setSelectedItem(item)
    setIsItemDialogOpen(true)
  }

  const handleDeleteItem = (item: any) => {
    setSelectedItem(item)
    setIsDeleteItemDialogOpen(true)
  }

  const confirmDeleteItem = async () => {
    if (!selectedItem) return

    try {
      await deleteMenuItem(selectedItem.id)
      setMenuItems((prev) => prev.filter((i) => i.id !== selectedItem.id))
      setIsDeleteItemDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete menu item:", error)
    }
  }

  const handleSaveItem = async () => {
    try {
      if (itemForm.id === 0) {
        // Create new menu item
        const { id } = await createMenuItem({
          category_id: itemForm.category_id,
          name: itemForm.name,
          description: itemForm.description,
          price: itemForm.price,
          is_vegan: itemForm.is_vegan,
          is_lactose_free: itemForm.is_lactose_free,
          is_gluten_free: itemForm.is_gluten_free,
          image: itemForm.image,
          order_index: itemForm.order_index,
        })

        const categoryName = categories.find((c) => c.id === itemForm.category_id)?.name || "Unknown Category"
        const newItem = { ...itemForm, id, categoryName }
        setMenuItems((prev) => [...prev, newItem])
      } else {
        // Update existing menu item
        await updateMenuItem(itemForm as MenuItem)
        const categoryName = categories.find((c) => c.id === itemForm.category_id)?.name || "Unknown Category"
        setMenuItems((prev) => prev.map((i) => (i.id === itemForm.id ? { ...itemForm, categoryName } : i)))
      }

      setIsItemDialogOpen(false)
    } catch (error) {
      console.error("Failed to save menu item:", error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restaurant Management</h1>
          <p className="text-muted-foreground">Manage menu categories and items</p>
        </div>
        {activeTab === "categories" ? (
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Category
          </Button>
        ) : (
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Menu Item
          </Button>
        )}
      </div>

      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories or menu items..."
          className="pl-8 w-full sm:w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || "-"}</TableCell>
                        <TableCell>{category.order_index}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                              className="h-8 w-8 p-0"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No categories found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Menu Items Tab */}
        <TabsContent value="items" className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Dietary</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.categoryName}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {item.is_vegan && (
                              <div className="text-green-600" title="Vegan">
                                <Leaf className="h-4 w-4" />
                              </div>
                            )}
                            {item.is_lactose_free && (
                              <div className="text-blue-600" title="Lactose Free">
                                <Milk className="h-4 w-4" />
                              </div>
                            )}
                            {item.is_gluten_free && (
                              <div className="text-amber-600" title="Gluten Free">
                                <Wheat className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditItem(item)}
                              className="h-8 w-8 p-0"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteItem(item)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No menu items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{categoryForm.id === 0 ? "Add New Category" : "Edit Category"}</DialogTitle>
            <DialogDescription>
              {categoryForm.id === 0 ? "Create a new menu category" : "Update the category details"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="order_index">Display Order</Label>
              <Input
                id="order_index"
                type="number"
                value={categoryForm.order_index}
                onChange={(e) => setCategoryForm({ ...categoryForm, order_index: Number(e.target.value) })}
                min={0}
              />
              <p className="text-sm text-muted-foreground">Lower numbers appear first</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>{categoryForm.id === 0 ? "Create Category" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{selectedCategory?.name}"? This will also delete all menu
              items in this category. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Menu Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{itemForm.id === 0 ? "Add New Menu Item" : "Edit Menu Item"}</DialogTitle>
            <DialogDescription>
              {itemForm.id === 0 ? "Create a new menu item" : "Update the menu item details"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="category_id">Category *</Label>
              <Select
                value={itemForm.category_id.toString()}
                onValueChange={(value) => setItemForm({ ...itemForm, category_id: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                placeholder="Enter item description"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  value={itemForm.price}
                  onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                  placeholder="e.g. €12.90"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Display Order</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={itemForm.order_index}
                  onChange={(e) => setItemForm({ ...itemForm, order_index: Number(e.target.value) })}
                  min={0}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                value={itemForm.image}
                onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>

            <div className="space-y-2">
              <Label>Dietary Options</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_vegan"
                    checked={itemForm.is_vegan}
                    onCheckedChange={(checked) => setItemForm({ ...itemForm, is_vegan: checked === true })}
                  />
                  <Label htmlFor="is_vegan" className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Vegan
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_lactose_free"
                    checked={itemForm.is_lactose_free}
                    onCheckedChange={(checked) => setItemForm({ ...itemForm, is_lactose_free: checked === true })}
                  />
                  <Label htmlFor="is_lactose_free" className="flex items-center gap-2">
                    <Milk className="h-4 w-4 text-blue-600" />
                    Lactose Free
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_gluten_free"
                    checked={itemForm.is_gluten_free}
                    onCheckedChange={(checked) => setItemForm({ ...itemForm, is_gluten_free: checked === true })}
                  />
                  <Label htmlFor="is_gluten_free" className="flex items-center gap-2">
                    <Wheat className="h-4 w-4 text-amber-600" />
                    Gluten Free
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>{itemForm.id === 0 ? "Create Menu Item" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Menu Item Dialog */}
      <Dialog open={isDeleteItemDialogOpen} onOpenChange={setIsDeleteItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the menu item "{selectedItem?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

