import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Size Guide</h1>
            
            <Tabs defaultValue="clothing" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="clothing">Clothing</TabsTrigger>
                <TabsTrigger value="footwear">Footwear</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="accessories">Accessories</TabsTrigger>
              </TabsList>

              <TabsContent value="clothing">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Men's Clothing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Size</th>
                              <th className="text-left py-2">Chest (in)</th>
                              <th className="text-left py-2">Waist (in)</th>
                              <th className="text-left py-2">Length (in)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2">S</td>
                              <td className="py-2">36-38</td>
                              <td className="py-2">30-32</td>
                              <td className="py-2">27</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">M</td>
                              <td className="py-2">38-40</td>
                              <td className="py-2">32-34</td>
                              <td className="py-2">28</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">L</td>
                              <td className="py-2">40-42</td>
                              <td className="py-2">34-36</td>
                              <td className="py-2">29</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">XL</td>
                              <td className="py-2">42-44</td>
                              <td className="py-2">36-38</td>
                              <td className="py-2">30</td>
                            </tr>
                            <tr>
                              <td className="py-2">XXL</td>
                              <td className="py-2">44-46</td>
                              <td className="py-2">38-40</td>
                              <td className="py-2">31</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Women's Clothing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Size</th>
                              <th className="text-left py-2">Bust (in)</th>
                              <th className="text-left py-2">Waist (in)</th>
                              <th className="text-left py-2">Hips (in)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2">XS</td>
                              <td className="py-2">32-34</td>
                              <td className="py-2">25-27</td>
                              <td className="py-2">35-37</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">S</td>
                              <td className="py-2">34-36</td>
                              <td className="py-2">27-29</td>
                              <td className="py-2">37-39</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">M</td>
                              <td className="py-2">36-38</td>
                              <td className="py-2">29-31</td>
                              <td className="py-2">39-41</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">L</td>
                              <td className="py-2">38-40</td>
                              <td className="py-2">31-33</td>
                              <td className="py-2">41-43</td>
                            </tr>
                            <tr>
                              <td className="py-2">XL</td>
                              <td className="py-2">40-42</td>
                              <td className="py-2">33-35</td>
                              <td className="py-2">43-45</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="footwear">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Footwear Size Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">US Men</th>
                              <th className="text-left py-2">US Women</th>
                              <th className="text-left py-2">UK</th>
                              <th className="text-left py-2">EU</th>
                              <th className="text-left py-2">CM</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2">6</td>
                              <td className="py-2">7.5</td>
                              <td className="py-2">5.5</td>
                              <td className="py-2">39</td>
                              <td className="py-2">24.5</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">7</td>
                              <td className="py-2">8.5</td>
                              <td className="py-2">6.5</td>
                              <td className="py-2">40</td>
                              <td className="py-2">25</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">8</td>
                              <td className="py-2">9.5</td>
                              <td className="py-2">7.5</td>
                              <td className="py-2">41</td>
                              <td className="py-2">26</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">9</td>
                              <td className="py-2">10.5</td>
                              <td className="py-2">8.5</td>
                              <td className="py-2">42</td>
                              <td className="py-2">27</td>
                            </tr>
                            <tr>
                              <td className="py-2">10</td>
                              <td className="py-2">11.5</td>
                              <td className="py-2">9.5</td>
                              <td className="py-2">43</td>
                              <td className="py-2">28</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="equipment">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Cricket Equipment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Cricket Bat Sizes</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>Size 1: Height 4'0" - 4'6"</li>
                            <li>Size 2: Height 4'3" - 4'9"</li>
                            <li>Size 3: Height 4'6" - 5'0"</li>
                            <li>Size 4: Height 4'9" - 5'3"</li>
                            <li>Size 5: Height 5'0" - 5'6"</li>
                            <li>Size 6 (Full): Height 5'6" and above</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Football Equipment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Football Sizes</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>Size 3: Ages 6-9 years</li>
                            <li>Size 4: Ages 10-13 years</li>
                            <li>Size 5: Ages 14+ years (Official size)</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="accessories">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Accessories Size Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Glove Sizes</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>XS: 6.5" - 7"</p>
                            <p>S: 7" - 7.5"</p>
                            <p>M: 7.5" - 8"</p>
                            <p>L: 8" - 8.5"</p>
                            <p>XL: 8.5" - 9"</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Cap Sizes</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>One Size: 22" - 24"</p>
                            <p>Adjustable: 20" - 24"</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
    </div>
  );
};

export default SizeGuide;